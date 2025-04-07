import base64
import os
import sys
import json
import mimetypes
from google import genai
from google.genai import types


def save_binary_file(file_name, data):
    f = open(file_name, "wb")
    f.write(data)
    f.close()


def generate(prompt, output_dir, story_id):
    try:
        # Create output directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        # Get API key from environment variable
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")
            
        client = genai.Client(
            api_key=api_key,
        )

        model = "gemini-2.0-flash-exp-image-generation"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=prompt),
                ],
            )
        ]
        
        generate_content_config = types.GenerateContentConfig(
            response_modalities=[
                "image",
                "text",
            ],
            response_mime_type="text/plain",
        )
        
        scene_images = []
        scene_num = 0
        
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if not chunk.candidates or not chunk.candidates[0].content or not chunk.candidates[0].content.parts:
                continue
                
            if chunk.candidates[0].content.parts[0].inline_data:
                scene_num += 1
                inline_data = chunk.candidates[0].content.parts[0].inline_data
                file_extension = mimetypes.guess_extension(inline_data.mime_type)
                
                # Format filename to match the server's expected format
                file_name = f"{story_id}_scene_{scene_num}_{int(os.path.getmtime(output_dir))}{file_extension}"
                file_path = os.path.join(output_dir, file_name)
                
                # Save the image
                save_binary_file(file_path, inline_data.data)
                
                # Add to results
                scene_images.append({
                    "sceneNumber": scene_num,
                    "imageUrl": f"/generated-images/{file_name}",
                    "success": True
                })
                
                print(f"File of mime type {inline_data.mime_type} saved to: {file_path}")
            else:
                print(chunk.text)
        
        # Return result as JSON
        result = {
            "success": True,
            "images": scene_images,
            "failedScenes": []
        }
        
        # Print the result JSON as the last line for the server to parse
        print("JSON_RESULT_MARKER")
        print(json.dumps(result))
        return result
        
    except Exception as e:
        error_result = {
            "success": False,
            "images": [],
            "failedScenes": list(range(1, 21)),  # Assuming up to 20 scenes
            "error": str(e)
        }
        print("JSON_RESULT_MARKER")
        print(json.dumps(error_result))
        return error_result


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python generate_images.py <prompt> <output_dir> <story_id>")
        sys.exit(1)
        
    prompt = sys.argv[1]
    output_dir = sys.argv[2]
    story_id = sys.argv[3]
    
    result = generate(prompt, output_dir, story_id)
    sys.exit(0 if result["success"] else 1)



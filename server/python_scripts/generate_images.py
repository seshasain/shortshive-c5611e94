import base64
import os
import sys
import json
import mimetypes
from google import genai
from google.genai import types
from PIL import Image
import io


def save_binary_file(file_name, data):
    f = open(file_name, "wb")
    f.write(data)
    f.close()


def convert_to_png(image_data):
    # Convert bytes to PIL Image
    image = Image.open(io.BytesIO(image_data))
    # Convert to RGB if necessary
    if image.mode in ('RGBA', 'LA'):
        background = Image.new('RGB', image.size, (255, 255, 255))
        background.paste(image, mask=image.split()[-1])
        image = background
    elif image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Save as PNG in memory
    output = io.BytesIO()
    image.save(output, format='PNG')
    return output.getvalue()


def generate(prompt, output_dir, story_id):
    try:
        # Make prompt very visible in logs using stderr
        sys.stderr.write("\n" + "="*80 + "\n")
        sys.stderr.write("PYTHON SCRIPT RECEIVED PROMPT:\n")
        sys.stderr.write("="*80 + "\n")
        sys.stderr.write(prompt + "\n")
        sys.stderr.write("="*80 + "\n\n")
        sys.stderr.flush()
        
        # Create output directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        client = genai.Client(
            api_key="AIzaSyB7Kv46ezacnh1jEWSE48ENfLIPMErDkgo",
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
                
                # Convert image to PNG
                png_data = convert_to_png(inline_data.data)
                
                # Save as PNG
                file_name = f"{story_id}_scene_{scene_num}_{int(os.path.getmtime(output_dir))}.png"
                file_path = os.path.join(output_dir, file_name)
                
                # Save the image
                save_binary_file(file_path, png_data)
                
                # Set correct permissions
                os.chmod(file_path, 0o644)  # rw-r--r--
                
                # Add to results
                scene_images.append({
                    "sceneNumber": scene_num,
                    "imageUrl": f"/generated-images/{file_name}",
                    "success": True
                })
            else:
                sys.stderr.write(f"API Response: {chunk.text}\n")
                sys.stderr.flush()
        
        # Return result as JSON with a marker
        result = {
            "success": True,
            "images": scene_images,
            "failedScenes": []
        }
        
        # Write only the JSON result to stdout
        sys.stdout.write("JSON_RESULT_MARKER:" + json.dumps(result) + "\n")
        sys.stdout.flush()
        return result
        
    except Exception as e:
        error_result = {
            "success": False,
            "images": [],
            "failedScenes": list(range(1, 21)),
            "error": str(e)
        }
        # Write error to stderr
        sys.stderr.write(f"Error: {str(e)}\n")
        sys.stderr.flush()
        # Write only the JSON result to stdout
        sys.stdout.write("JSON_RESULT_MARKER:" + json.dumps(error_result) + "\n")
        sys.stdout.flush()
        return error_result

if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.stderr.write("Usage: python generate_images.py <prompt> <output_dir> <story_id>\n")
        sys.exit(1)
        
    prompt = sys.argv[1]
    output_dir = sys.argv[2]
    story_id = sys.argv[3]
    
    generate(prompt, output_dir, story_id)



import base64
import os
import sys
import json
import mimetypes
import logging
from google import genai
from google.genai import types

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": %(message)s}',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

def log_message(message, level="info", extra=None):
    """Helper function to log messages in JSON format"""
    log_data = {"message": message}
    if extra:
        log_data.update(extra)
    json_message = json.dumps(log_data)
    
    if level == "error":
        logger.error(json_message)
    elif level == "warning":
        logger.warning(json_message)
    else:
        logger.info(json_message)

def save_binary_file(file_name, data):
    try:
        f = open(file_name, "wb")
        f.write(data)
        f.close()
        log_message(f"Successfully saved binary file", extra={"filename": file_name})
    except Exception as e:
        log_message(f"Failed to save binary file: {str(e)}", level="error", extra={"filename": file_name})
        raise

def generate(prompt, output_dir, story_id):
    try:
        log_message("Starting image generation", extra={"story_id": story_id})
        
        # Save prompt to debug file
        debug_file = os.path.join(output_dir, f"{story_id}_prompt_debug.txt")
        with open(debug_file, "w") as f:
            f.write(f"PROMPT RECEIVED BY PYTHON SCRIPT:\n\n{prompt}")
            f.write("\n\n---END OF PROMPT---\n")
        log_message("Saved prompt to debug file", extra={"debug_file": debug_file})
        
        # Create output directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            log_message(f"Created output directory", extra={"output_dir": output_dir})
            
        # Get API key from environment variable
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            log_message("GEMINI_API_KEY environment variable is not set", level="error")
            print("ERROR: GEMINI_API_KEY environment variable is not set")
            return False
            
        log_message("Initializing Gemini client")
        client = genai.Client(
            api_key=api_key,
        )

        model = "gemini-2.0-flash-exp-image-generation"
        log_message("Using Gemini model", extra={"model": model})

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
        
        log_message("Starting content generation stream")
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
                
                log_message(
                    "Generated and saved image",
                    extra={
                        "scene_number": scene_num,
                        "mime_type": inline_data.mime_type,
                        "file_path": file_path
                    }
                )
            else:
                log_message("Received text response", extra={"text": chunk.text})
                print(chunk.text)
        
        # Return result as JSON
        result = {
            "success": True,
            "images": scene_images,
            "failedScenes": []
        }
        
        log_message("Generation completed successfully", extra={"num_images": len(scene_images)})
        
        # Print the result JSON as the last line for the server to parse
        print("JSON_RESULT_MARKER")
        print(json.dumps(result))
        return result
        
    except Exception as e:
        error_message = str(e)
        log_message(
            "Generation failed",
            level="error",
            extra={
                "error": error_message,
                "story_id": story_id
            }
        )
        error_result = {
            "success": False,
            "images": [],
            "failedScenes": list(range(1, 21)),  # Assuming up to 20 scenes
            "error": error_message
        }
        print("JSON_RESULT_MARKER")
        print(json.dumps(error_result))
        return error_result


if __name__ == "__main__":
    if len(sys.argv) != 4:
        log_message("Invalid number of arguments", level="error", extra={"args": sys.argv})
        print("Usage: python generate_images.py <prompt> <output_dir> <story_id>")
        sys.exit(1)
        
    prompt = sys.argv[1]
    output_dir = sys.argv[2]
    story_id = sys.argv[3]
    
    log_message("Starting script", extra={
        "prompt_length": len(prompt),
        "output_dir": output_dir,
        "story_id": story_id
    })
    
    result = generate(prompt, output_dir, story_id)
    sys.exit(0 if result["success"] else 1)



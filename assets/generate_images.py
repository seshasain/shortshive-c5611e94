import base64
import os
import mimetypes
from google import genai
from google.genai import types


def save_binary_file(file_name, data):
    f = open(file_name, "wb")
    f.write(data)
    f.close()


def generate():
    client = genai.Client(
        api_key="AIzaSyB7Kv46ezacnh1jEWSE48ENfLIPMErDkgo",
    )

    model = "gemini-2.0-flash-exp-image-generation"
    contents = [
        types.Content(
    role="user",
    parts=[
        types.Part.from_text(text="""Generate a series of 20 high-quality Pixar-style 3D animation images for a story titled \"Story Title\".\n\nGeneral style specifications for all images:\n- Pixar-style 3D animation\n- Soft, colorful, expressive 3D animation with high quality rendering\n- Aspect ratio: 16:9\n- Clear, detailed characters with expressive features\n- Beautiful lighting and composition\n- High level of detail and polish\n- Make sure the images clearly convey each scene's emotion and story context.\n\nThe story features these characters:\n- No specific characters defined\n\nCreate one image for each of the following scenes:\n\nSCENE 1:\nOpen on a lush, vibrant forest filled with glowing flora. The camera focuses on a small clearing where construction markers and ribbons are being placed, encroaching on the fairy realm. Fifi peeks from behind a giant mushroom, her eyes wide with worry, observing the human activity with a trembling hand covering her mouth.\n\nSCENE 2:\nFifi nervously flits around her mushroom home, wringing her tiny hands. She tries to speak, but only stutters and mumbles to herself. She finally takes a deep breath and flies purposefully towards the edge of the forest, determination replacing her fear.\n\nSCENE 3:\nFifi hovers in front of Maya, who is examining a flower near the construction markers. Fifi tries to speak, but only squeaks and gestures wildly at the markers, then at the forest, flapping her wings erratically. Maya looks confused, then giggles, thinking Fifi is a cute, buzzing insect trying to play.\n\nSCENE 4:\nClose up on Fifi's determined face. She watches Maya speaking to her mom on a phone, observing the sounds and mouth movements. Scene cuts to Fifi practicing in front of a flower, slowly and deliberately mouthing simple words and pointing to objects – 'Tree... Help... Forest.'\n\nSCENE 5:\nFifi finds Maya again near the markers. This time, she takes a deep breath and speaks clearly, albeit softly, pointing at the markers and then the trees: 'Trees... sad... Help forest.' Maya stops, looks directly at Fifi with wide, surprised eyes, and slowly kneels down, listening intently.\n\nSCENE 6:\nMaya introduces Fifi to her parents at their home. Her parents look skeptical at first, but then amazed as the tiny fairy demonstrates her newfound speech. Fifi points to a map on the wall showing the construction site and frantically explains the importance of the forest habitat.\n\nSCENE 7:\nMaya's father, a construction manager, brings Fifi and Maya to a meeting with developers. The room is filled with serious-looking adults in business attire. Fifi, now more confident, stands on a table giving an impassioned speech while Maya supports her with visual aids showing the forest's ecosystem.\n\nSCENE 8:\nA team of environmental scientists follows Fifi through the magical forest. She proudly shows them the rare glowing plants and introduces them to other shy fairy folk who peek out from hiding places. The scientists take notes and photographs with expressions of wonder.\n\nSCENE 9:\nMontage of scenes: Maya and Fifi holding hands, Maya talking to construction workers and pointing at the forest, workers removing markers, construction vehicles being rerouted around the fairy realm, establishing a protected area.\n\nSCENE 10:\nEnd scene with a celebration in the forest. Fairies and humans mingling together. Fifi and Maya sit on a mushroom cap, looking at architectural plans for a nature preserve visitor center that will protect the forest while educating humans. The forest glows brighter than ever as fairy dust sparkles throughout the scene.\n\nSCENE 11:\nThe construction site is seen from a distance, now halted. Workers pack up and leave, but Maya and Fifi stand on the edge, watching as a large protective barrier is put in place around the fairy forest. Fifi looks up at Maya, her eyes sparkling with gratitude.\n\nSCENE 12:\nFifi visits the ancient, hidden part of the forest. The camera shows her flying through a dense, mysterious grove, filled with towering trees and strange, magical creatures peeking out. The atmosphere is tranquil yet full of wonder.\n\nSCENE 13:\nMaya and Fifi stand before a group of schoolchildren on a field trip. Maya tells the kids about the forest, while Fifi shyly waves from behind Maya. The kids' eyes are wide with amazement as they look at the tiny fairy.\n\nSCENE 14:\nFifi shows Maya a secret part of the forest where the trees glow under the moonlight. Maya kneels down to touch the glowing leaves, her face lit with awe, while Fifi hovers nearby, smiling warmly.\n\nSCENE 15:\nA wide shot of the newly protected forest, with a large sign in front that reads "Protected Area – Do Not Disturb." Humans and fairies now coexist peacefully. Fifi and Maya walk side by side, talking happily as the sun sets in the background.\n\nSCENE 16:\nFifi meets a wise, older fairy who tells her ancient stories about the forest. The old fairy is seated on a large mushroom, surrounded by glowing fireflies. Fifi listens intently, her face full of admiration.\n\nSCENE 17:\nFifi and Maya share a quiet moment by a small stream. Maya is sketching in a notebook while Fifi dips her fingers into the water. The forest around them is serene, with soft light filtering through the trees.\n\nSCENE 18:\nThe first day of the nature preserve opens to the public. Humans and fairies stand side by side, guiding visitors through the forest. Fifi flits around, showing off her favorite spots to the tourists, while Maya talks to the crowd about conservation.\n\nSCENE 19:\nAt the nature preserve's visitor center, Fifi gives a small speech to a group of interested visitors. Maya stands beside her, holding a chart with facts about the forest ecosystem. The crowd is captivated by the little fairy's passion for the forest.\n\nSCENE 20:\nThe final scene shows Fifi and Maya watching the stars from the forest's highest point. They sit together, content and peaceful, knowing their efforts have preserved the forest. The camera pulls back to show the glowing trees and the soft hum of the forest at night, a symbol of their success and the ongoing protection of the magical realm.\n\nPlease provide exactly 20 images, one for each of the scenes described above."""),
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
    i=0
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if not chunk.candidates or not chunk.candidates[0].content or not chunk.candidates[0].content.parts:
            continue
        if chunk.candidates[0].content.parts[0].inline_data:
            file_name = "f"+str(i)
            i=i+1
            inline_data = chunk.candidates[0].content.parts[0].inline_data
            file_extension = mimetypes.guess_extension(inline_data.mime_type)
            save_binary_file(
                f"{file_name}{file_extension}", inline_data.data
            )
            print(
                "File of mime type"
                f" {inline_data.mime_type} saved"
                f"to: {file_name}"
            )
        else:
            print(chunk.text)

if __name__ == "__main__":
    generate()

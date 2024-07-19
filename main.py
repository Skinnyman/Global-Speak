from flask import Flask, request, render_template
import whisper
import os

app = Flask(__name__)

# Load the Whisper model
model = whisper.load_model("tiny")

# Home page 
@app.route('/')
def index():
    return render_template('index.html')

# translation page
@app.route('/translate')
def translate():
    return render_template('translate.html')


@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'file' not in request.files:
        return "No file part"
    file = request.files['file']
    if file.filename == '':
        return "No selected file"

    # Save the file to disk temporarily
    file_path = os.path.join('uploads', file.filename)
    file.save(file_path)

    # Transcribe the audio using Whisper
    result = model.transcribe(file_path)

    # Get the transcription
    transcription = result['text']

    # Clean up: remove the uploaded file
    os.remove(file_path)

    # Render the result on the HTML page
    return render_template('translate.html', transcription=transcription)


if __name__ == '__main__':
    # Ensure the 'uploads' directory exists
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    # Run the Flask app on a specified port
    app.run(debug=True, port=8080)

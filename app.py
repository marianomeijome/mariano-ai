import os

from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory
from werkzeug.utils import secure_filename
import tensorflow as tf

#from data.dogid.mypup import *
from data.digits.predict import *
from data.normals.predict import *
import re
import base64
import cv2
import io

UPLOAD_FOLDER = 'static/uploads/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])


app = Flask(__name__, static_url_path="/static", static_folder="static")

global graph
graph = tf.get_default_graph()

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# homepage
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/digits')
def api_root():
    return render_template('mydigits.html')

@app.route('/resume')
def about():
    return redirect("static/resumeMeijome.pdf")

@app.route('/normals', methods = ["GET"])
def normals():
    return render_template('normals.html')


#dogid results page
@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

@app.route('/predict-normals', methods = ['GET', 'POST'])
def predict_normals():
    sz = 512
    # In this case, we read the image data from a base64 data URL    
    file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
    output = generate_normals(file, sz)
    
    # Return the prediction
    return output



@app.route('/post-data-url', methods = ['POST'])
def api_predict_from_dataurl():
    # In this case, we read the image data from a base64 data URL
    imgstring = request.form.get('data')
    
    # Stripping the metadata
    imgstring = imgstring.replace("data:image/png;base64,", "")
    
    # Decoding
    imgdata = base64.b64decode(imgstring)
    
    # save image
    filename = 'canvas_image.png'
    with open(filename, 'wb') as f:
        f.write(imgdata)
    
    # read img
    img = cv2.imread('canvas_image.png', 0)
    
    # Resize to fit the neural network
    imgsmall = cv2.resize(img, (28,28))
    
    # Reshape for the model
    data = imgsmall.reshape(-1, 28,28,1)/255
    
    # Convert to white-on-black
    data = ValueInvert(data)
    
    # Generate prediction
    pred = mnist_model.predict(data)
    
    # Return the prediction
    return str(np.argmax(pred[0]))

# Takes an array, assumed to contain values between 0 and 1, and inverts
# those values with the transformation x -> 1 - x.
def ValueInvert(array):
    # Flatten the array for looping
    flatarray = array.flatten()
    
    # Apply transformation to flattened array
    for i in range(flatarray.size):
        flatarray[i] = 1 - flatarray[i]
        
    # Return the transformed array, with the original shape
    return flatarray.reshape(array.shape)


if __name__ == '__main__':
#    app.secret_key = 'super secret key'
    app.config['SESSION_TYPE'] = 'filesystem'

    app.run(host='0.0.0.0', port=80)
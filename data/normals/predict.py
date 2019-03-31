from keras.models import load_model
import cv2
import matplotlib.pyplot as plt
import skimage
import imageio
from PIL import Image
import numpy as np
import datetime
import uuid


model = load_model("data/normals/models/normal_generator.h5")
model._make_predict_function()


def generate_normals(img_path, sz):
    
    # takes user image as input, preprocesses it,
    # and returns the prediction
    # example use: predict_user_img('digit3.png', 'mnist_model')
    
    img = plt.imread(img_path)
    
    # drop alpha channel if png
    if(img.shape[2] == 4 ):
        img = img[:,:,:3]
        
    img = cv2.resize(img, (sz, sz))
    output = model.predict(skimage.img_as_float(img).reshape(1,sz,sz,3))
    upload_dir = 'static/uploads/'
    filename = upload_dir + str(uuid.uuid4())+ '.jpg'
    imageio.imwrite(filename, output.reshape(sz,sz,3))
    
    return filename

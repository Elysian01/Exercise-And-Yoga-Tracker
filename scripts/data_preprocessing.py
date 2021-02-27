import os
import time
from PIL import Image


def png_to_jpg(basedir):
    for foldername in os.listdir(basedir):
        folder_path = os.path.join(basedir, foldername)
        for filename in os.listdir(folder_path):

            extension = os.path.splitext(filename)[1]
            if extension == ".png":
                img_path = os.path.join(folder_path, filename)
                img = Image.open(img_path)
                if not img.mode == 'RGB':
                    img = img.convert('RGB')

                img.save(os.path.splitext(img_path)[0] + ".jpg")
                os.remove(img_path)
                img.close()
    print("All PNG Files Converted to JPG")


def rename_and_convert_png_to_jpg(basedir):
    for foldername in os.listdir(basedir):
        folder_path = os.path.join(basedir, foldername)
        i = 1
        for filename in os.listdir(folder_path):

            extension = os.path.splitext(filename)[1]
            new_filename = str(i) + extension
            os.rename(os.path.join(folder_path, filename),
                      os.path.join(folder_path, new_filename))
            i += 1
    print("Image file are renamed starting from 1 to n.jpg")


if __name__ == '__main__':

    # basedir = "dataset\\train"
    # rename_and_convert_png_to_jpg(basedir)
    # png_to_jpg(basedir)

    basedir = "dataset\\test"
    rename_and_convert_png_to_jpg(basedir)
    png_to_jpg(basedir)

FROM python:3.6-slim-stretch

RUN apt update
RUN apt install -y python3-dev gcc

# Source Code
WORKDIR /app
ADD . /app


# Install any needed packages specified in requirements.txt
ADD requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Make ports 80 or 4000 available to the world outside this container
EXPOSE 80
# EXPOSE 4000

# Run app.py when the container launches
CMD ["python", "app/app.py"]



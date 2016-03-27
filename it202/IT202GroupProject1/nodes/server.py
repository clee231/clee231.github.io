#!/usr/bin/python

# Requirements: Python 2.7, Adafruit_DHT, Google Python API

import Adafruit_DHT
import httplib2
from apiclient.discovery import build
import datetime
from oauth2client import client
from oauth2client.file import Storage
from oauth2client import tools
import argparse
import ConfigParser
import os
import sys

filepath = os.path.dirname(os.path.abspath(__file__))

parser = argparse.ArgumentParser(parents=[tools.argparser])
flags = parser.parse_args()

config = ConfigParser.ConfigParser()
config.read(filepath + '/' + '.env')

# Function to return a tuple with a readout from the sensor: (temperature, humidity)
def readDHT22(pin, show=False):
    sensor = Adafruit_DHT.DHT22
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
    if humidity is not None and temperature is not None:
        if (show):
            print 'Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temperature, humidity)
        return temperature, humidity
    else:
        print 'Failed to get reading. Try again!'

# Function to send data to google via OAuth2 and the Google Python API.
def googlePOST(temperature, humidity):
    flow = client.flow_from_clientsecrets(
	filepath+'/'+config.get('Config', 'client_secrets_file'),
    scope='https://www.googleapis.com/auth/fusiontables')
    http = httplib2.Http()
    storage = Storage(filepath + '/' + 'sec_storage.enc')
    parser = argparse.ArgumentParser(parents=[tools.argparser])
    flags = parser.parse_args()
    if(storage.get()):
        credentials = storage.get()
    else:
        credentials = tools.run_flow(flow, storage, flags)
    storage.put(credentials)
    http_auth = credentials.authorize(http)
    service = build('fusiontables', 'v2',developerKey=config.get('Config', 'google_api_key'), http=http_auth)
    query = service.query()
    sqlstring = "INSERT INTO {:s} (nodeid, temperature, humidity, date) VALUES ({:d}, {:f}, {:f}, '{:s}');".format(config.get('Config', 'table_id'), int(config.get('Config', 'node_id')), temperature, humidity, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    query.sql(sql=sqlstring).execute()

# Main function to read sensor, send data, and exit gracefully.
def main():
    temp, hum = readDHT22(4)
    googlePOST(temp, hum)
    sys.exit()

 
if __name__ == "__main__":
    main()

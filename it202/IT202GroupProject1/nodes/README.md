Temperature Sensor and Fusion Table Interface
=============================================

Author: Mackenzie Carter & Chase Lee

Additional resources by:
 * Adafruit
 * Python


Requirements / Dependencies
---------------------------

 * Python 2.7
 * Adafruit_Python_DHT (https://github.com/adafruit/Adafruit_Python_DHT.git)
 * Python-dev
 * Python-openssl
 * Google API Python Client (https://pypi.python.org/pypi/google-api-python-client/)
   * httplib2<1,>=0.8
   * uritemplate<1,>=0.6
   * oauth2client<3,>=2.0.0
   * pyasn1>=0.1.7
   * pyasn1-modules>=0.0.5
   * rsa>=3.1.4
   * simplejson>=2.5.0


Installation
------------

 1. Install Python 2.7 from your preferred distribution package manager.
 2. Install Pip or easy_install for easy Python package management.
 3. Install python_dev & python_openssl via your distribution's package manager or pip/easy_install.
 4. Clone Adafruit_Python_DHT library (See github link in requirement section above)
 5. Change directory into the Adafruit_Python_DHT library and run the following: `sudo python2 setup.py install`
    Make sure you follow any prompts that the install may give you.
 6. Install Google API Python Client: `pip2 install --upgrade google-api-python-client`
 6. In the /nodes directory, download the clients secret json file from the Google Developer Console.
 7. Copy .env_example to .env and change the values in that configuration file.
 8. Copy ambientReport.service and ambientReport.timer into `/usr/lib/systemd/system/`.
 9. Enable and start the timer: `sudo systemctl enable ambientReport.timer && sudo systemctl start ambientReport.timer`


Running
-------

`sudo python2 server.py --noauth_local_webserver`

On the first run, the Google API will prompt you to verify the use of the Google Fusions Table API via OAuth2 protocols.
You will need to copy the URL that it outputs and login with your credentials that have write access to the Google Fusion Table ID referenced in the .env file.


Setting Up a repeating job
--------------------------

On Archlinux, you can use Systemd/Timers:


 1. Copy ambientReport.timer and ambientReport.service into /usr/lib/systemd/system/. (This will install a service to run the server every minute)
 2. Adjust and verify the paths referenced in ambientReport.service.
 3. Enable and start the timer: `sudo systemtctl enable ambientReport.timer && sudo systemctl start ambientReport.service`

Configuration Setup
-------------------

In order for the server to successfully connect to the Google Fusions Tables, we need to setup proper configuration settings.

Most of the configuration of the server is controlled within the `.env` file.
You may make a copy of `.env_example` to create the `.env` file.

Here are descriptions of each used property in `.env`:

**google_api_key** - This API key is obtained by going to the API Credential Manager within the Google Developer Console and creating a *Server Key* API Key.

**table_id** - This is the unique ID for the Google Fusion Table. Note that the user you use to create the client_secrets and API keys will need to have write access to this table.  The unique ID is found in the *docid* parameter in the URL of the Fusion Table.

**client_secrets_file** - This JSON file is created by yet another credential created in the API Manager section of the Google Developer Console.  You will create this by creating a *OAuth client ID* and selecting an Application Type of *Other*.  Download the JSON file that the console produces and place it in the same directory as the `.env` file.

**node_id** - Specifies which node number is reported in the Google Fusion Table.

When the server is run, it will need access to pins on the GPIO. (Running as sudo is the easy and dangerous solution.)  The server will also need access to write to the `sec_storage.enc` file.


Google Fusion Table Setup
-------------------------

The Google Fusion Table should have the following columns:

[Column Name] - [Type]
 * nodeid - Number
 * temperature - Number
 * humidity - Number
 * date - Date/Time

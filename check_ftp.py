import ftplib
import os

host = "ftp.royalseeds.net"
user = "kufre@app.garrizon.com"
password = "Ilove3lia1986"

try:
    with ftplib.FTP(host) as ftp:
        ftp.login(user=user, passwd=password)
        print(f"Successfully connected to {host}")
        
        print("\nRoot Directory Listing:")
        ftp.retrlines('LIST')
        
        # Check if public_html exists
        file_list = ftp.nlst()
        if "public_html" in file_list:
            print("\nFound public_html directory.")
        else:
            print("\npublic_html not found in root.")

except Exception as e:
    print(f"Error connecting to FTP: {e}")

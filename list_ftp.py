import ftplib

host = "ftp.royalseeds.net"
user = "kufre@app.garrizon.com"
password = "Ilove3lia1986"

try:
    with ftplib.FTP(host) as ftp:
        ftp.login(user=user, passwd=password)
        lines = []
        ftp.dir(lines.append)
        with open('ftp_listing.txt', 'w') as f:
            for line in lines:
                f.write(line + "\n")
        print("Listing saved to ftp_listing.txt")
except Exception as e:
    print(f"Error: {e}")

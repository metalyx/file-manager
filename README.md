# File Manager

This is File Manager App. You can use it like simple version of Google Drive or Dropbox. Just create account and upload your files.

Demo link: https://file-manager-5ug7.onrender.com

## Features

1. **Login, Authorization, Registration**<br>I used JWT to perform generating token and protecting routes. As well as protecting your files.
2. **Uploading files**<br>I store files in the MongoDB itself as Buffer. There is a limit for single file ~16MB. So you can upload any file up to ~15.72MB.
3. **Changing files access**<br>By default all files are visible only for you. Nobody can see or download your files. But you can make each file public and get a direct link to your file. You can switch access as much as you want. It is really convenient.
4. **Direct link to the file**<br>You can make direct links to your public files. Other users don't need to have an account to download it. All they need is direct link to your file.
5. **Storing files**<br>Once you have your account, just upload your files and they are all with you now. You can access them from any device. All you need is internet and your account credentials.
6. **Deleting files**<br>You can always delete any of your files, and they will not be available anymore.

## How to use?

The process is pretty straightforward.

1. Sign in into your account or create a new one.
2. Once you are in, upload file(s).
3. You'll see how many space is still available at the app for you.
4. Click on share button at the corresponding file to make it public.
5. Use this link to share it with others.
6. Keep it private if you don't want it to be shared.
7. Delete file if you don't need it here anymore.

## Future thoughts / Ideas

1. Create folders so user could organize their files.
2. Create plans for more space / file size.
3. GridFS / Amazon S3 for file storage.

## Contacts

Email: vitalii.tereshchenko1@gmail.com<br>
Check out my portfolio: https://portfolio-app-rhq1.onrender.com/

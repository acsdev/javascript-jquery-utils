## Many useful codes in javascript / jquery

### Repository organization

- files (WebProject use to demonstrate useful codes)    
- nodejs
    - backend _(http server that provides mock data for samples that use ajax)_
    - frontend _(http server that provides static web page)_

### How to use

1. Download or clone the repository
######
2. Inside the folder **nodes/backend** execute the command bellow:
    - **npm install** (Only at the first time to download node_modules directory)
    - **npm run debug**
######    
3. Inside the folder **nodes/frontend** execute the command bellow:
    - **npm install** (Only at the first time to download node_modules directory)
    - **npm run debug**
######
4. Now, you shoud be able to access the page with samples at http://localhost:8000
######
5. Ajax mock data will be provided from http://localhost:3000


### Sumary of functions (javascript pure)
|Function|Description|
|---:|---|
|sleep|Stop execution for some time|
|randomString / randomPercentNumber / randomDate|Generate random data|
|jsonEquals|Test if json is equals|
|orderNumberLevels|Order level numbers|
|copyFromText|Copy text to clipboard.|
|getFileNameArray|Get an array of file name information.|
|inputFileToBase64|Get value from input file and convert to base64 string.|
|downloadFileWithBase64|Get an base64 string, convert to byte and download it. Use function base64ToArrayBuffer as auxiliary function.|

### Sumary of functions (javascript with jquery)
|Function|Description|
|---:|---|
|formatMessage|Format parametrized string|
|selectOneWaiting|Shows '. . .' while wait for data|
|addOptionsOnSelect|Add many 'option' on combobox|
|execStack|Execute functions in order|
|addValueOnJSON|Get an value from an input and put into JSON|
|addValueWithDottedNotation|User by addValueOnJSON function to put data into JSON|
|convertJsonObjectToDotNotationObject|Get json object and convert into a map (dottednotation:value)|
|putDataOnScreenFromDotNotationObject|Get dottednotation value and put data into inputs|

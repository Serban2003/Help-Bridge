# Help-Bridge

## Installation
1. Open GitBash and type ```git clone https://github.com/Serban2003/Help-Bridge.git```
2. Install [Node.js](https://nodejs.org/dist/v22.15.0/node-v22.15.0-x64.msi)
3. Open the Help-Bridge folder with VSCode
4. Install the React.js - open terminal and type:
```
cd Website
npm i
cd help_bridge
npm run build
```
5. Install Bootstrap: `npm install react-bootstrap bootstrap`
6. Install Lucide (for icons): `npm install lucide-react`
7. Install server:
```
cd ..\..\Server\
npm install bcrypt
npm I
```
8. Install the database by using the script provided in the Database folder
9. Populate the database by using the script provided in the Database folder (may require ID changes)

## Run
1. Server (in Server folder)
```
node .\server.js
```
2. Website (in help_bridge folder)
```
npm run build
npm run start
```

## Requirements
- GitBash
- VSCode
- [Node.js](https://nodejs.org/dist/v22.15.0/node-v22.15.0-x64.msi)
- (SQL Server)[https://go.microsoft.com/fwlink/p/?linkid=2215158&clcid=0x409&culture=en-us&country=us]
- msodbcsql.msi (driver)[https://go.microsoft.com/fwlink/?linkid=2307162] (you can also find it in the Drivers directory)

## Additional info
- `ts_created` represents the time when the entry was added to the database (useful if you want to know when a user was created)
- `ts_created` fields from the database are created automatically by the database (no need to insert values into them)
- For now, all `I_id` fields are null, and the `Profile_Images` table is empty

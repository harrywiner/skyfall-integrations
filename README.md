## Initialise typescript in VSCode
Source: [Amazing Video](https://youtu.be/JdvkaW2xeiI)

`npx tsc --init --sourceMap`

ctrl + shift + p -> configure build task
tsc: watch

`command shift b` to run the build task

> This will build and compile the typescript into javascript automatically, describing errors in the terminal


## Handover to Sohan
`TestSamsara` and `TestZeroNox` detail the full functionality of the code as it exists. 

See the provided Notion documentation for design justification

`integrations` contains the two main objects, `ZeroNoxIntegration.ts` and `SamsaraLocationIntegration.ts`

`src` contains interface methods for the respective api integrations

`lib` will be created upon building the typescript, and contains the js


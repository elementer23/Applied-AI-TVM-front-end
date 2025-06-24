# Getting Started with Installing node

If you already got node installed on your pc, then skip this step.

The first thing that should be done, is install the latest node version through this link. [Download Node js](https://nodejs.org/en/download).

It can be done, by simply downloading the Windows installer and to follow the natural install procedure upon running the .msi file.

## Installing Node Modules

Once you've got the project on your pc, in your respected environment. The corresponding node modules should be installed, in order to properly run the project.

**(Be sure to execute the commands inside of the root folder of the project.)**

This can be done by executing the following command inside off the terminal from your code editor or inside off powershell.

```bash
npm  install
```

## Setup environment variables

In order to make a proper connection to the api a dotenv file should be made (**.env**). This file should be made inside of the root folder of the project and should only contain a single variable. `REACT_APP_API_BASE_URL=<Fill_in_your_api_connection>.` There is an example inside off the **.env.dist**.

## Run the front-end

To check whether the project works, simply run the following command inside off the terminal or powershell.

First head to the root folder, depending on where you have it installed.

```bash
cd Applied-AI-TVM-front-end/tvm-front-end
```

When you're in the root folder, execute the simple command depending on which package handler you're using.

**Developer mode**

```bash
npm start
```

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

**Build the project**

```bash
npm run build
```

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

**Eject the project**

```bash
npm run eject
```

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Pingster UI
> Never let your APIs down! Pingster is the tool that allows you test any API requests that are used inside your apps and projects. The Pingster UI offers you an easy to use user interface for your running [pingster server](https://github.com/zenmate/pingster-server).

![pingster ui](https://image.ibb.co/cA8y8b/Screen_Shot_2018_01_27_at_13_28_13.png)

## Usage
Make sure you have a instance of [pingster server](https://github.com/zenmate/pingster-server) running.
Clone this repository and install all required dependencies, run the app locally and check if everything works:
```bash
git clone git@github.com:zenmate/pingster-ui.git
cd pingster-ui
npm i
REACT_APP_PINGSTER_API='https://your-pinster-server.example.com' npm run
```

### Configuration
Please make sure you define the environmental variable REACT_APP_PINGSTER_API with your pingster-server
URL. You can also adjust the configuration withing the [config](./config) folder.

### Deployment
npm run build creates a build directory with a production build of pingster-ui:

```bash
REACT_APP_PINGSTER_API='https://your-pinster-server.example.com' npm run build
 ```

 For environments using Node, the easiest way to handle the deployment would be to install serve and let it handle the rest:

 ```bash
 npm install -g serve
serve -s build
 ```

You can also serve the build folder from any other instance (like s3 or nginx).

## Development
The app is based on the [create-react-app](https://github.com/facebook/create-react-app) package:

```bash
REACT_APP_PINGSTER_API='https://your-pinster-server.example.com' npm start
```

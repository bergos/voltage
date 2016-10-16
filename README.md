# voltage

Voltage is a HTML5 multimeter.
The Node.js backend sends the data of the multimeter to the browser via WebSockets.
The [UNI-T UT61E](https://github.com/bergos/ut61e) is supported and a dummy random multimeter can be used to test the application.

## Usage

The package runs out of the box with the dummy multimeter.
Just type:

    npm start

and open [http://localhost:3000/](http://localhost:3000/) in your browser window.

### Using the UNI-T UT61E

See the requirements in the [UNI-T UT61E](https://github.com/bergos/ut61e) package.
Comment the `random` device, uncomment the `ut61e` device in the `config.js` file and adapt the pathes to your local system.

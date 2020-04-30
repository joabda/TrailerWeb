# TrailerWeb
MEAN Stack Web application simulating Netflix like app but with youtube trailers.
Manager using [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

# Important

Commands starting with `npm` or `yarn` will have to be executed in the `client`, `server` or `cors-anywhere` directory.

## Dependencies installation

-   Get `npm` or `yarn`

-   Execute `npm install` or `yarn`

## Starting the app

Execute : `npm start` or `yarn start` in the `client`, `server` and `cors-anywhere` directories.

Client :
A page with the adress: `http://localhost:4200/` will be automatically opened.

Server :
Is accessible on: `http://localhost:3000`.

If you change the app's code it will be reloaded automatically, only for `client` and `cors-anywhere` .

## Generate new components (Client Side)

Using angular CLI: 
	`ng g c component-name` for a new component.
	`ng g s service-name` for a new service.

You can also use `ng g directive|pipe|service|class|guard|interface|enum|module nameOfWhatYouWant` for other parts of yout project.

## Unit testing

-   Execute `npm run test` or `yarn test`.

-   Execute `npm run coverage` or `yarn coverage` to generate coverage report.

## TSLint

-   Execute `npm run lint`.

-   Execute `npm run lint -- --fix` or `yarn lint --fix` to automatically resolve certain lint errors.

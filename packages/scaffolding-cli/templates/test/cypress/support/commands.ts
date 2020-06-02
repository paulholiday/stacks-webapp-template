// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const _ = Cypress._


// Load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to login and redirect back to app
         * @example cy.login().then((resp) => { expect(resp.status).to.eq(200) }
         */
        login(): Chainable<Response>
        /**
         * Custom command to perform a lighthouse check on a given page
         * @example cy.lighthouse() }
         */
        // lighthouse(url?: any, thresholds?: any, opts?: {}, config?: any): Chainable<any>
        lighthouse(thresholds?: {performance?: number, accessibility?: number, "best-practices"?: number, seo?: number, pwa?: number}, opts?: {}, config?: any): Chainable<any>
    }
}

require("cypress-audit/src/performances/commands") 

Cypress.Commands.overwrite("lighthouse",  (originalFn, thresholds, opts, config) => {
    return originalFn(thresholds, opts, config)
})

Cypress.Commands.add("login", (overrides = {}) => {
    const options = {
        method: "POST",
        url: "https://example.com",
        qs: {
            // use qs to set query string to the url that creates
            // http://auth.corp.com:8080?redirectTo=http://localhost:7074/set_token
            redirectTo: "http://example.com",
        },
        form: true, // we are submitting a regular form body
        body: {
            username: "",
            password: "",
        },
    }

    // allow us to override defaults with passed in overrides
    _.extend(options, overrides)

    cy.request(options)
})


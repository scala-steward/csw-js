import {Auth} from "../Auth";
import {KeycloakInstance} from "keycloak-js";

let promise= Promise.resolve(false)

export const mockedPromise = {
  success : (callback) => {
    promise.then(callback)
    return this
  },

  error : callback => {
    promise.catch(callback)
    return this
  }
}

export const mockAuth : Auth = {
  token: () => 'some token',
  logout: jest.fn(),
  tokenParsed: jest.fn(),
  realmAccess: jest.fn(),
  resourceAccess: jest.fn(),
  loadUserProfile: jest.fn(),
  isAuthenticated: jest.fn(),
  hasRealmRole:  (role: string) => true,
  hasResourceRole:(role: string, resource?: string) =>true
}

export const mockKeycloak = mockAuth

const TMTAuth = {
  getAASUrl: jest.fn().mockImplementation(() => {
    console.log("mocked getAASUrl")
    return 'http://mockhost:mockport'
  }),
  from: jest.fn().mockImplementation((sm : KeycloakInstance) => {
    console.log("mocked from")
    return mockAuth
  }),
  authenticate: jest.fn().mockImplementation(() => {
    console.log("mocked authenticate")
    return {keycloak: mockKeycloak, authenticated:mockedPromise }
  }),
}

export default TMTAuth

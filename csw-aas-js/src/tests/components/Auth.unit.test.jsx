import { TMTAuth } from '../../components/Auth'
import KeyCloak from 'keycloak-js'
import { ServiceResolver } from '../../components/ServiceResolver'

jest.mock('keycloak-js')

jest.mock('../../components/ServiceResolver')

// DEOPSCSW-630 - Javascript adapter for AAS
describe('<TMTAuth />', () => {
  beforeEach(() => {
    ServiceResolver.mockClear()
  })

  it('should create TMTAuth instance', () => {
    const mockKeycloak = {
      logout: jest.fn(),
      token: 'token string',
      tokenParsed: { name: 'test' },
      realmAccess: { roles: ['test-realm-roles'] },
      resourceAccess: ['test-resource-roles'],
      loadUserProfile: jest.fn(),
      authenticated: false,
    }

    const auth = TMTAuth.from(mockKeycloak)

    expect(auth.logout).toBe(mockKeycloak.logout)
    expect(auth.token()).toBe(mockKeycloak.token)
    expect(auth.tokenParsed()).toBe(mockKeycloak.tokenParsed)
    expect(auth.realmAccess()).toBe(mockKeycloak.realmAccess)
    expect(auth.resourceAccess()).toBe(mockKeycloak.resourceAccess)
    expect(auth.loadUserProfile).toBe(mockKeycloak.loadUserProfile)
    expect(auth.isAuthenticated()).toBe(false)
    expect(auth.hasRealmRole).toBe(mockKeycloak.hasRealmRole)
    expect(auth.hasResourceRole).toBe(mockKeycloak.hasResourceRole)
  })

  it('should authenticate', () => {
    const mockKeycloak = {
      init: jest.fn().mockImplementation(() => {
        return Promise.resolve(true)
      }),
      onTokenExpired: jest.fn(),
      updateToken: jest.fn().mockImplementation(() => {
        return Promise.resolve(true)
      }),
    }

    const initMock = jest.spyOn(mockKeycloak, 'init')

    KeyCloak.mockReturnValue(mockKeycloak)

    const { keycloak, authenticated } = TMTAuth.authenticate(
      {
        realm: 'example',
        clientId: 'example-app',
      },
      'http://somehost:someport',
      true,
    )

    expect(initMock).toHaveBeenCalledWith({
      onLoad: 'login-required',
      flow: 'hybrid',
    })
    expect(keycloak).toBe(mockKeycloak)
    expect(authenticated).toEqual(Promise.resolve(true))
    initMock.mockRestore()
  })

  it('should getAASUrl from location service', async () => {
    ServiceResolver.mockReturnValue(Promise.resolve('http://AAS_IP:AAS_Port/auth'))

    const url = await TMTAuth.getAASUrl()

    expect(ServiceResolver).toHaveBeenCalledTimes(1)
    expect(url).toBe('http://AAS_IP:AAS_Port/auth')
  })

  it('should getAASUrl from config', async () => {
    ServiceResolver.mockReturnValue(Promise.resolve(null))

    const url = await TMTAuth.getAASUrl()

    expect(ServiceResolver).toHaveBeenCalledTimes(1)
    expect(url).toBe('http://localhost:8081/auth')
  })
})

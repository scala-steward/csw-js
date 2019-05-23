import React, { useEffect, useState } from 'react'
import { Provider } from './AuthContext'
import { Auth} from '../Auth'
import TMTAuth from "../AuthHelper";

/**
 * React component which is wrapper over provider of react context api.
 * Responsible for instantiating keycloak and provide context value to consumers
 * props -
 * config json specific to UI application e.g. realm and clientId
 * children - react component or html element which can have consumer to access
 * context provided
 */
export interface AuthContextProps {
  config: {
    realm: string
    clientId: string
  }
  children: React.ReactNode
}

const AuthContextProvider = (props: AuthContextProps) => {
  const [auth, setauth] = useState<Auth | null>(null)

  /**
   * Instantiate keycloak and sets TMTAuthStore instance in state. This state can be provided
   * as a context
   */
  const instantiateAAS = async ( url: string , redirect: boolean) => {
    const { keycloak, authenticated } = await TMTAuth.authenticate(
      props.config,
      url,
      redirect,
    )
    authenticated
      .success(() => {
        const _auth = TMTAuth.from(keycloak)
        setauth(_auth)
      })
      .error(() => {
        setauth(null)
      })
  }

  /**
   * Resolves AAS server and instantiate keycloak in check-sso mode
   */
  const loginWithoutRedirect = async () => {
    const url = await TMTAuth.getAASUrl()
    await instantiateAAS(url , false)
  }

  useEffect(() => {
    loginWithoutRedirect()
  }, [])

  /**
   * Resolves AAS server and instantiate keycloak in login-required mode
   */
  const login = async () => {
    const url = await TMTAuth.getAASUrl()
    await instantiateAAS( url , true)
  }

  const logout = async () => {
    if (auth && auth.logout) {
      const logoutPromise = await auth.logout()
      logoutPromise.success(() => {
        setauth(null)
      })
    }
  }

  return (
    <Provider value={{ auth: auth, login: login, logout: logout }}>
      {props.children}
    </Provider>
  )
}

export default AuthContextProvider

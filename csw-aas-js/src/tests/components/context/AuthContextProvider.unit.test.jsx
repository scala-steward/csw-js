import React, {useContext} from "react"
import {AuthContext} from "../../../components/context/AuthContext";
import Enzyme from 'enzyme'
import AuthContextProvider from "../../../components/context/AuthContextProvider";
import {resolveAAS} from '../../../components/AASResolver'
import Adapter from "enzyme-adapter-react-16/build";

jest.mock('../../../components/AASResolver')
jest.mock('../../../components/AuthHelper')

describe('<AuthContextProvider />', () => {
  Enzyme.configure({ adapter: new Adapter() })

  beforeEach(() => {
    resolveAAS.mockClear()
  })

  it("provider",()=>{

    const testChild = () => {
      const {auth} = useContext(AuthContext)
      console.log(auth)
      return <span>{auth.token()}</span>
    }

      const config = {
        realm: "master",
        clientId: "test-client"
      }

    let testComp = Enzyme.mount(<AuthContextProvider
      config={config}>{testChild}</AuthContextProvider>);

    expect(testComp.html()).toEqual("<span>some token</span>");
  })

})


import { shallowMount, createLocalVue } from "@vue/test-utils"
import PageNetwork from "network/PageNetwork"

const localVue = createLocalVue()

describe(`PageNetwork`, () => {
  let wrapper

  const networks = [
    {
      id: "gaia-testnet",
      chain_id: "gaia-123",
      logo_url: "cosmos-logo.png",
      testnet: true,
      title: "Cosmos Hub Test"
    },
    {
      id: "cosmoshub",
      chain_id: "cosmoshub",
      logo_url: "cosmos-logo.png",
      testnet: false,
      title: "Cosmos Hub"
    }
  ]

  beforeEach(() => {
    wrapper = shallowMount(PageNetwork, {
      localVue,
      mocks: {
        $store: {
          dispatch: jest.fn(),
          state: {
            connection: {
              network: `gaia-testnet`
            }
          }
        },
        $route: {
          params: { height: `100` }
        },
        $router: {
          push: jest.fn()
        }
      },
      stubs: [`router-link`]
    })
    wrapper.setData({ networks })
  })

  it(`shows a page with a selection of networks`, () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it(`has 2 network lists`, () => {
    expect(wrapper.findAll("ul").length).toBe(2)
  })

  it("sets new network when clicking list item", () => {
    wrapper.find(".select-network-item").trigger("click")
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(`setNetwork`, {
      id: "cosmoshub",
      chain_id: "cosmoshub",
      logo_url: "cosmos-logo.png",
      testnet: false,
      title: "Cosmos Hub"
    })
  })
})

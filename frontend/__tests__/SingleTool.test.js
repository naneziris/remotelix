import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import SingleTool, { SINGLE_TOOL_QUERY } from '../components/SingleTool';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeTool } from '../lib/testUtils';

describe('<SingleTool/>', () => {
  it('renders with proper data', async () => {
    const mocks = [
      {
        // when someone makes a request with this query and variable combo
        request: { query: SINGLE_TOOL_QUERY, variables: { id: '123' } },
        // return this fake data (mocked data)
        result: {
          data: {
            tool: fakeTool(),
          },
        },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleTool id="123" />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading...');
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    expect(toJSON(wrapper.find('h2'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('img'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('p'))).toMatchSnapshot();
  });

  it('Errors with a not found tool', async () => {
    const mocks = [
      {
        request: { query: SINGLE_TOOL_QUERY, variables: { id: '123' } },
        result: {
          errors: [{ message: 'Tools Not Found!' }],
        },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleTool id="123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    console.log(wrapper.debug());
    const tool = wrapper.find('[data-test="graphql-error"]');
    expect(tool.text()).toContain('Tools Not Found!');
    expect(toJSON(tool)).toMatchSnapshot();
  });
});

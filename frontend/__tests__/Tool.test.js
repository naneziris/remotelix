import ToolComponent from '../components/Tool';
import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeTool = {
  id: 'ABC123',
  title: 'A Cool tool',
  url: 'www.remotelix.com',
  description: 'This tool is really cool!',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg',
};

describe('<Tool/>', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ToolComponent tool={fakeTool} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('renders the image properly', () => {
    const wrapper = shallow(<ToolComponent tool={fakeTool} />);
    const img = wrapper.find('img');
    expect(img.props().src).toBe(fakeTool.image);
    expect(img.props().alt).toBe(fakeTool.title);
  });

  it('renders the  title', () => {
    const wrapper = shallow(<ToolComponent tool={fakeTool} />);
    expect(wrapper.find('Title a').text()).toBe(fakeTool.title);
  });

  it('renders out the buttons properly', () => {
    const wrapper = shallow(<ToolComponent tool={fakeTool} />);
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(2);
    expect(buttonList.find('Link')).toHaveLength(1);
    expect(buttonList.find('DeleteTool').exists()).toBe(true);
  });
});

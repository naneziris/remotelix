import Tools from '../components/Tools';

const Home = props => (
  <div>
    <Tools page={parseFloat(props.query.page) || 1} />
  </div>
);

export default Home;

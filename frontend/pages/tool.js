import SingleTool from '../components/SingleTool';

const Tool = props => (
  <div>
    <SingleTool id={props.query.id} />
  </div>
);

export default Tool;

export const SimpleButton = (props) => {
  return (
    <button className={'simple-button'} onClick={props.onClick}>
      {props.label}
    </button>
  );
};

export const SimpleHeader = (props) => {
    return (
      <div className={"simple-header"}>
        <h1>{props.labels.title}</h1>
  
        <span id={'change-language-button'} onClick={props.onClickChangeLanguage}>
          {props.labels.changeLanguage}
        </span>
      </div>
    );
  };
  
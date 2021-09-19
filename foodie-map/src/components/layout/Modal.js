import Categories from "../data/Categories";

function Modal(props) {
  function updateHandler(target) {
    const restaruantID = target.id;
    target.favourite = !target.favourite;
    fetch(
      `${process.env.REACT_APP_FIREBASE_URL}/restaurants/${restaruantID}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(target),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (!props.restaurant.favourite) {
    return (
      <div className="modal">
        <p>Select Type of Cuisine</p>
        {Categories.map((item) => (
          <div key={item.id}>
            <button
              key={item.title}
              className="btn btn--alt"
              onClick={() => {
                const target = props.restaurant;
                target.category = item.title;
                updateHandler(target);
                props.onClose();
              }}
            >
              {item.title}
            </button>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="modal">
        <p>Are you sure to remove {props.restaurant.title} from favorite?</p>
        <button
          className="btn"
          onClick={() => {
            updateHandler(props.restaurant);
            props.onClose();
          }}
        >
          Yes
        </button>
        <button className="btn" onClick={props.onClose}>
          Cancel
        </button>
      </div>
    );
  }
}

export default Modal;

import { useEffect, useState } from "react";

export default function PermissionArea({ data, onChange, disabled }) {
  const [dataState, setDataState] = useState();
  useEffect(() => {
    if (data !== undefined) {
      setDataState(() => {
        return data;
      });
    }
  }, [data]);

  function selectAllHandler() {
    setDataState((prevState) => {
      const children = prevState.children.map((permit) => {
        return {
          ...permit,
          isChecked: !prevState.isCheckedAll,
        };
      });

      const returnData = {
        ...prevState,
        children: children,
        isCheckedAll: !prevState.isCheckedAll,
      };

      onChange({ data: returnData, group: prevState.group });
      return returnData;
    });
  }

  function changeHandler({ loadedElement }) {
    const children = dataState.children.map((permit) => {
      if (permit.loadedElement === loadedElement)
        return {
          ...permit,
          isChecked: !permit.isChecked,
        };
      return permit;
    });

    let checkCount = 0;
    children.map((permit) => {
      if (permit.isChecked === true) checkCount++;
    });

    if (checkCount === children.length) {
      setDataState((prevState) => {
        const returnData = {
          ...prevState,
          isCheckedAll: true,
          children: children,
        };

        onChange({ data: returnData, group: prevState.group });
        return returnData;
      });
    } else {
      setDataState((prevState) => {
        const returnData = {
          ...prevState,
          isCheckedAll: false,
          children: children,
        };

        onChange({ data: returnData, group: prevState.group });
        return returnData;
      });
    }
  }

  return dataState !== undefined ? (
    <div style={{ margin: "1rem" }}>
      <div className="row form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id={dataState?.group}
          name={dataState?.group}
          onChange={selectAllHandler}
          checked={dataState?.isCheckedAll}
          disabled={disabled}
        />
        <label className="text-dark fw-bold" htmlFor={dataState?.group}>
          {dataState?.featName}
        </label>
      </div>
      <div className="row row-cols-3">
        {dataState?.children &&
          dataState.children.map((permit, index) => {
            return (
              <div className="col form-check" key={index}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={permit.loadedElement}
                  name={permit.loadedElement}
                  checked={permit.isChecked}
                  onChange={() =>
                    changeHandler({
                      loadedElement: permit.loadedElement,
                    })
                  }
                  disabled={disabled}
                />
                <label className="text-dark" htmlFor={permit.loadedElement}>
                  {permit.featName}
                </label>
              </div>
            );
          })}
      </div>
    </div>
  ) : (
    <></>
  );
}

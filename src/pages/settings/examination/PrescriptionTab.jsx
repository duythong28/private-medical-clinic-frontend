import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";

import TableBody from "../../../components/TableBody";
import TableHeader from "../../../components/TableHeader";
import { prescriptionAction } from "../../../store/prescription";
import { fetchRecordDetailByRecordId } from "../../../services/appointmentRecordDetails";
import SearchDrugInput from "./SearchDrugInput";
import { useEffect, useState } from "react";

export default function PreScriptionTab({ recordId, isEditable }) {
  const dispatch = useDispatch();
  const [currentPresciptionData, setCurrentPrescriptionData] = useState([]);

  const drugState = useSelector((state) => state.drug);
  const unitState = useSelector((state) => state.unit);
  const usagaState = useSelector((state) => state.usage);
  const prescriptionState = useSelector((state) => state.prescription);

  function getUnitName({ id }) {
    const res = unitState.filter((unit) => unit.id === id)[0];
    return res.unitName;
  }

  function getUsageDes({ id }) {
    const res = usagaState.filter((usage) => {
      return usage.id == id;
    })[0];
    return res?.usageDes ?? "";
  }

  const recordDetailMutate = useMutation({
    mutationFn: fetchRecordDetailByRecordId,
    onSuccess: (data) => {
      const recordDetailData =
        data &&
        data.map((record) => {
          const drugData = drugState.filter(
            (drug) => drug.id === record.drugId
          );
          const recordDetail = {
            id: record.drugId,
            drugName: drugData[0]?.drugName,
            amount: record.count,
            unitId: drugData[0]?.unitId,
            usageId: record.usageId,
            count: drugData[0]?.count,
          };
          return recordDetail;
        });

      setCurrentPrescriptionData(() => {
        return recordDetailData ?? [];
      });
    },
  });

  function updateDrug({ event, id, type }) {
    const value = event.target.value;
    dispatch(prescriptionAction.updateDrug({ type, id, value }));
  }

  function deleteHandler({ id }) {
    dispatch(prescriptionAction.removeDrug({ id: id }));
  }

  useEffect(() => {
    if (!recordId) {
      setCurrentPrescriptionData(() => {
        return prescriptionState;
      });
    }
  }, [prescriptionState]);

  useEffect(() => {
    if (recordId) {
      recordDetailMutate.mutate({ id: recordId });
    }
  }, [recordId]);

  return (
    <div className="w-100 h-100 d-flex flex-column gap-3">
      {!recordId && <SearchDrugInput />}
      <TableHeader>
        <div className="text-start" style={{ width: "5%" }}></div>
        <div className="text-start" style={{ width: "20%" }}>
          Tên thuốc
        </div>
        <div className="text-start" style={{ width: "14%" }}>
          Số lượng
        </div>
        <div className="text-start" style={{ width: "15%" }}>
          Đơn vị
        </div>

        <div className="text-start" style={{ width: "35%" }}>
          Cách dùng
        </div>
        {isEditable && (
          <div className="text-end" style={{ width: "10%" }}>
            Thao tác
          </div>
        )}
        <div style={{ width: "1%" }}></div>
      </TableHeader>
      <TableBody>
        {currentPresciptionData.map((drug) => {
          return (
            <li
              className="list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
              key={drug.id}
            >
              <div className="text-start" style={{ width: "5%" }}>
                {isEditable ? (
                  <input
                    className="form-check-input me-1"
                    type="checkbox"
                    value=""
                    id="firstCheckbox"
                  />
                ) : (
                  currentPresciptionData.indexOf(drug) + 1
                )}
              </div>
              <div className="text-start" style={{ width: "20%" }}>
                {drug.drugName}
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                {isEditable ? (
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step="1"
                    min="1"
                    max={drug.count ?? ""}
                    defaultValue={drug.amount}
                    name="amount"
                    onChange={(event) =>
                      updateDrug({ event, id: drug.id, type: "amount" })
                    }
                  />
                ) : (
                  drug.amount
                )}
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                {getUnitName({ id: drug.unitId })}
              </div>
              <div className="text-start" style={{ width: "35%" }}>
                {isEditable ? (
                  <select
                    className="w-100"
                    name="usageid"
                    defaultValue={drug.usageId}
                    onChange={(event) =>
                      updateDrug({ event, id: drug.id, type: "usage" })
                    }
                  >
                    {usagaState &&
                      usagaState.map((usage) => {
                        return (
                          <option key={usage.id} value={usage.id}>
                            {usage.usageDes}
                          </option>
                        );
                      })}
                  </select>
                ) : (
                  getUsageDes({ id: drug.usageId })
                )}
              </div>
              {isEditable && (
                <div className="text-end" style={{ width: "10%" }}>
                  <span
                    className="p-2"
                    onClick={() => deleteHandler({ id: drug.id })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#1B59F8"
                      className="bi bi-archive-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z" />
                    </svg>
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </TableBody>
    </div>
  );
}

import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import TableBody from "../../../components/TableBody";
import TableHeader from "../../../components/TableHeader";
import { prescriptionAction } from "../../../store/prescription";
import { fetchRecordDetailByRecordId } from "../../../services/appointmentRecordDetails";
import SearchDrugInput from "./SearchDrugInput";
import { fetchAllUsage } from "../../../services/usage";
import { fetchAllDrugs } from "../../../services/drugs";
import { fetchAllUnit } from "../../../services/units";
import { formatNumber } from "../../../util/money";

export default function PreScriptionTab({
  recordId,
  isEditable,
  setExpense,
  isBill,
}) {
  const dispatch = useDispatch();
  const [currentPresciptionData, setCurrentPrescriptionData] = useState([]);

  const unitsQuery = useQuery({
    queryKey: ["units"],
    queryFn: fetchAllUnit,
  });

  const usageQuery = useQuery({
    queryKey: ["usages"],
    queryFn: fetchAllUsage,
  });

  const drugsQuery = useQuery({
    queryKey: ["drugs"],
    queryFn: fetchAllDrugs,
  });

  const drugState = drugsQuery.data;
  const unitState = unitsQuery.data;
  const usagaState = usageQuery.data;

  const prescriptionState = useSelector((state) => state.prescription);

  function getUnitName({ id }) {
    const res = unitState.filter((unit) => unit.id === id)[0];
    return res?.unitName || "";
  }

  function getUsageDes({ id }) {
    const res = usagaState.filter((usage) => {
      return usage.id == id;
    })[0];
    return res?.usageDes || "";
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
            note: drugData[0].note,
            unitId: drugData[0]?.unitId,
            usageId: record.usageId,
            count: drugData[0]?.count,
            price: drugData[0]?.price,
            totalPrice: record.count * drugData[0]?.price,
          };
          if (setExpense) {
            setExpense({ totalPrice: recordDetail?.totalPrice });
          }
          return recordDetail;
        });

      setCurrentPrescriptionData(() => {
        return recordDetailData;
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
        <div className="text-start" style={{ width: "5%" }}>
          STT
        </div>
        <div className="text-start" style={{ width: isBill ? "19%" : "22%" }}>
          Thuốc
        </div>
        <div className="text-start" style={{ width: isBill ? "10%" : "15%" }}>
          Số lượng
        </div>
        <div className="text-start" style={{ width: isBill ? "10%" : "15%" }}>
          Đơn vị
        </div>
        <div className="text-start" style={{ width: isBill ? "35%" : "30%" }}>
          Cách dùng
        </div>
        {isBill && (
          <>
            <div className="text-start" style={{ width: "10%" }}>
              Đơn giá
            </div>
            <div className="text-start" style={{ width: "10%" }}>
              Thành tiền
            </div>
          </>
        )}
        {isEditable && (
          <div className="text-end" style={{ width: "10%" }}>
            Thao tác
          </div>
        )}
        <div style={{ width: "1%" }}></div>
      </TableHeader>
      <TableBody isEditable={!isEditable}>
        {currentPresciptionData.map((drug) => {
          return (
            <li
              className="list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
              key={drug.id}
            >
              <div className="text-start" style={{ width: "5%" }}>
                {currentPresciptionData.indexOf(drug) + 1}
              </div>
              <div
                className="text-start"
                style={{ width: isBill ? "20%" : "23%" }}
              >
                {drug.drugName}
                {drug.note && (
                  <>
                    <span>{" (" + drug.note + " )"}</span>
                  </>
                )}
              </div>
              <div
                className="text-start"
                style={{ width: isBill ? "10%" : "15%" }}
              >
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
              <div
                className="text-start"
                style={{ width: isBill ? "10%" : "15%" }}
              >
                {getUnitName({ id: drug.unitId })}
              </div>
              <div
                className="text-start"
                style={{ width: isBill ? "35%" : "30%" }}
              >
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
              {isBill && (
                <>
                  <div className="text-start" style={{ width: "10%" }}>
                    {formatNumber(drug.price)}
                  </div>
                  <div className="text-start" style={{ width: "10%" }}>
                    {formatNumber(drug.totalPrice)}
                  </div>
                </>
              )}

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

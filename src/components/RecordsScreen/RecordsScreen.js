import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listRecords, getRecord } from "graphql/queries";
import {
  updateRecord,
  deleteRecord,
  createRecord,
} from "graphgraphql/mutations";

import { RecordSchema, getDescriptors, getView } from "common";
import { Browser } from "components/Browser";

export const RecordsScreen = ({ viewName }) => {
  const view = getView({
    descriptors: getDescriptors(RecordSchema),
    viewName,
  });
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      const {
        data: {
          listRecords: { items: projects },
        },
      } = await API.graphql(graphqlOperation(listRecords));
      setRecords(projects);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Browser
      entries={records}
      view={view}
      getOp={getRecord}
      deleteOp={deleteRecord}
      updateOp={updateRecord}
      createOp={createRecord}
    />
  );
};

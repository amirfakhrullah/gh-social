"use client";

import { useEffect, useState } from "react";

const A_MINUTE_IN_MILLISECONDS = 60000;

const useRefetchTimer = (time?: number) => {
  const duration = time ?? A_MINUTE_IN_MILLISECONDS;
  const [toRefetch, setToRefetch] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!toRefetch) {
      timeout = setTimeout(() => {
        setToRefetch(true);
      }, duration);
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toRefetch]);

  const restartTimer = () => setToRefetch(false);

  return <div>useRefetchTimer</div>;
};

export default useRefetchTimer;

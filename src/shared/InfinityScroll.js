import React from "react";

import Spinner from "../elements/Spinner";
import _ from "lodash";

const InfinityScroll = (props) => {
  const { children, callNext, is_next, loading } = props;

  // 쓰로틀을 적용
  const _handleScroll = _.throttle(() => {
    const { innerHeight } = window;
    const { scrollHeight } = document.body;

    // 스크롤 계산!
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;

    if (scrollHeight - innerHeight - scrollTop < 200) {
      if (loading) {
        return;
      }

      callNext();
    }
  }, 300);

  const handleScroll = React.useCallback(_handleScroll, [loading]);

  React.useEffect(() => {
    if (loading) {
      return;
    }
    
    // 다음 게 있으면 이벤트를 붙이고, 없으면 이벤트를 삭제
    if (is_next) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }

    // 이 부분은 컴포넌트가 사라질 때 호출되는 부분
    return () => window.removeEventListener("scroll", handleScroll);
  }, [is_next, loading]);

  return (
    <React.Fragment>
      {children}
      {is_next && <Spinner />}
    </React.Fragment>
  );
};

InfinityScroll.defaultProps = {
  children: null,
  callNext: () => {},
  is_next: false,
  loading: false,
};

export default InfinityScroll;
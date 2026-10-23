
import React from 'react';
import OriginalDocItemLayout from '@theme-original/DocItem/Layout';
import DocNavigation from '@site/src/components/DocNavigation';

export default function DocItemLayoutWrapper(props) {
  return (
    <>
      <DocNavigation position="top" />
      <OriginalDocItemLayout {...props} />
    </>
  );
}

import NavigationBarLayout from '@/modules/navigationLayout/NavigationBarLayout';
import React from 'react';

const ProtectedLayout: React.FC<React.PropsWithChildren<{}>> = ({ children}) => {
  return (
    <NavigationBarLayout>
      <div>{children}</div>
    </NavigationBarLayout>
  );
};


export default ProtectedLayout;
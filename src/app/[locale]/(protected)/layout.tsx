import NavigationBarLayout from '@/modules/navigationLayout/NavigationBarLayout';
import React from 'react';
import  WrappedValidator  from '@/shared/validator/WrappedValidator';

const ProtectedLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <WrappedValidator>
      <NavigationBarLayout>
        {children}
      </NavigationBarLayout>
    </WrappedValidator>
  );
};


export default ProtectedLayout;
import React from 'react';
import ModalTaskView from '../common/modals/task/view';
import ModalCategory from '../common/modals/category';

export default function View({ children }: { children: React.ReactNode }) {
  return (
    <ModalTaskView>
      <ModalCategory>{children}</ModalCategory>
    </ModalTaskView>
  );
}

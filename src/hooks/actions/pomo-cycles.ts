import { generateUUID } from '@/utilities/generators/id';
import { useAppDispatch, useAppSelector } from '../redux';
import { PomoCycleGet } from '@/types/models/pomo-cycle';
import { Status } from '@generated/prisma';
import { useItemEditContext } from '@/components/contexts/item-edit';
import {
  addPomoCycle,
  updatePomoCycle,
  deletePomoCycle,
} from '@/libraries/redux/slices/pomo-cycles';

export const usePomoCycleActions = () => {
  const session = useAppSelector((state) => state.session.value);
  const pomoCycles = useAppSelector((state) => state.pomoCycles.value);
  const categories = useAppSelector((state) => state.categories.value);
  const dispatch = useAppDispatch();

  const { editing, editingId, setEditingState, startRename, inputRefs } =
    useItemEditContext();

  // handler to create pomoCycle
  const handleCreatePomoCycle = (params?: {
    values?: Partial<PomoCycleGet>;
  }) => {
    if (!session?.id) return;

    const pomoCycleNew = {
      ...params?.values,
      id: params?.values?.id || generateUUID(),
      current_session_id: params?.values?.current_session_id || null,
      profile_id: params?.values?.profile_id || session.id,
      status: params?.values?.status || Status.ACTIVE,
    };

    // add to state
    dispatch(addPomoCycle(pomoCycleNew));

    return pomoCycleNew;
  };

  // handler to update pomoCycle
  const handleUpdatePomoCycle = (params: { values: PomoCycleGet }) => {
    // update in state
    dispatch(updatePomoCycle(params.values));
  };

  // handler to delete pomoCycle
  const handleDeletePomoCycle = (params: {
    values: PomoCycleGet;
    options?: { noRedirect?: boolean };
  }) => {
    // deleted from state
    dispatch(deletePomoCycle(params.values));
  };

  return {
    pomoCycles,
    categories,
    createPomoCycle: handleCreatePomoCycle,
    updatePomoCycle: handleUpdatePomoCycle,
    deletePomoCycle: handleDeletePomoCycle,
    // rename stuff
    pomoCycleEditing: editing,
    pomoCycleEditingId: editingId,
    setPomoCycleEditingState: setEditingState,
    startPomoCycleRename: startRename,
    pomoCycleInputRefs: inputRefs,
  };
};

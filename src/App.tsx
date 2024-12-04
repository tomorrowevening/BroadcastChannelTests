// Libs
import { useEffect, useMemo, useState } from 'react'
// Remote
import RemoteController from './remote/RemoteController';
import BasicChat from './components/BasicChat';
import SharedInteractions from './components/SharedInteractions';
// Utils
import isEditor from './utils/isEditor';

function App() {
  // Memo
  const remote = useMemo(() => new RemoteController('MyApp'), []);

  // States
  const [ready, setReady] = useState(false);

  // Relay editor status
  useEffect(() => {
    const editor = isEditor();
    remote.isApp = !editor;
    setReady(true);
    return () => {
      remote.dispose();
    }
  }, [remote]);

  return (
    <>
      {ready && (
        <>
          <h1>BroadcastChannel experiments</h1>
          <div id="grid">
            <BasicChat remote={remote} />
            <SharedInteractions remote={remote} />
          </div>
        </>
      )}
    </>
  );
}

export default App

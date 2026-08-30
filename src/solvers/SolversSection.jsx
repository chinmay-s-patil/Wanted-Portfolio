import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { filesystem, getPromptPath } from './filesystemModel';
import { processCommand } from './commandProcessor';
import { tabComplete } from './tabCompleter';
import { renderBanner } from './openfoamBannerTemplate';
import { solverData } from './solverData';
import ViewportScaleStage from '../common/ViewportScaleStage';
import './SolversSection.css';

/* ═════════════════════════════════════════════════════════════════
   CENTERED HEADER
   ═════════════════════════════════════════════════════════════════ */
function CenteredHeader({ onBack }) {
  return (
    <header className="centered-header">
      <button className="header-back" onClick={onBack}>
        <span className="header-back-arrow">←</span>
        <span>Back to Office</span>
      </button>
      <div className="header-content">
        <span className="header-kicker">OpenFOAM Toolkit</span>
        <h1 className="header-title">The Terminal</h1>
        <p className="header-desc">
          Navigate custom solvers like a real shell. Families are directories, variants are source files.
          <br />
          Type <code>help</code> to begin, or click any entry to explore.
        </p>
      </div>
    </header>
  );
}

/* ═════════════════════════════════════════════════════════════════
   BANNER RENDERER
   ═════════════════════════════════════════════════════════════════ */
function BannerOutput({ variant, family }) {
  const lines = useMemo(() => renderBanner(variant, family), [variant, family]);

  return (
    <div className="banner-block" role="region" aria-label={`Source file header for ${variant.application}`}>
      {lines.map((line, i) => (
        <div key={i} className={`banner-line banner-${line.type}`}>
          {line.text}
        </div>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   SCROLLBACK LINE
   ═════════════════════════════════════════════════════════════════ */
function ScrollbackLine({ line, onCommandClick }) {
  if (line.type === 'banner') {
    return <BannerOutput variant={line.variant} family={line.family} />;
  }

  if (line.type === 'error') {
    return <div className="scrollback-error">{line.text}</div>;
  }

  if (line.clickable) {
    const isDir = line.type === 'directory';
    const command = isDir ? `cd ${line.text}` : `cat ${line.text}`;
    return (
      <button
        className={`scrollback-link scrollback-${line.type}`}
        onClick={() => onCommandClick(command)}
        aria-label={`${isDir ? 'Enter directory' : 'View file'} ${line.text}`}
      >
        {isDir ? '[DIR] ' : '[FILE] '}{line.text}
      </button>
    );
  }

  if (line.type === 'command') {
    return <span className="scrollback-command">{line.text}</span>;
  }

  return <div className="scrollback-text">{line.text}</div>;
}

/* ═════════════════════════════════════════════════════════════════
   ACCESSIBLE SOLVER INDEX
   ═════════════════════════════════════════════════════════════════ */
function AccessibleSolverIndex({ onCommandClick }) {
  return (
    <div className="accessible-index" role="complementary" aria-label="Solver index">
      <h3 className="accessible-title">Solver Index</h3>
      {solverData.map(family => (
        <div key={family.id} className="accessible-family">
          <button
            className="accessible-family-btn"
            onClick={() => onCommandClick(`cd ~/solvers/${family.folderName}`)}
            style={{ '--family-accent': family.accentColor }}
          >
            <span className="accessible-family-icon">&gt;</span>
            <span className="accessible-family-name">{family.displayLabel}</span>
            <span className="accessible-family-short">{family.folderName}/</span>
          </button>
          <ul className="accessible-variant-list">
            {family.variants.map(variant => (
              <li key={variant.id}>
                <button
                  className="accessible-variant-btn"
                  onClick={() => {
                    onCommandClick(`cd ~/solvers/${family.folderName}`);
                    setTimeout(() => onCommandClick(`cat ${variant.fileName}`), 50);
                  }}
                >
                  <span className="accessible-variant-icon">-</span>
                  <span>{variant.fileName}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   TERMINAL PANEL
   ═════════════════════════════════════════════════════════════════ */
function TerminalPanel({ externalCommand, onExternalCommandHandled }) {
  const [currentDir, setCurrentDir] = useState(filesystem);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabState, setTabState] = useState({ lastInput: null, count: 0 });
  const scrollbackRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollbackRef.current) {
      scrollbackRef.current.scrollTop = scrollbackRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (externalCommand) {
      executeCommand(externalCommand);
      onExternalCommandHandled();
    }
  }, [externalCommand]);

  const executeCommand = useCallback((cmdStr) => {
    const result = processCommand(currentDir, cmdStr);

    if (result.clear) {
      setHistory([]);
      setCurrentDir(result.newDir);
      return;
    }

    const promptPath = getPromptPath(currentDir);
    const newEntry = {
      prompt: `${promptPath} $`,
      command: cmdStr,
      lines: result.outputLines
    };

    setHistory(prev => [...prev, newEntry]);
    setCurrentDir(result.newDir);

    if (cmdStr.trim()) {
      setCommandHistory(prev => {
        const filtered = prev.filter(c => c !== cmdStr);
        return [...filtered, cmdStr];
      });
      setHistoryIndex(-1);
    }
  }, [currentDir]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!input.trim()) return;

    executeCommand(input);
    setInput('');
    setTabState({ lastInput: null, count: 0 });
  }, [input, executeCommand]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const result = tabComplete(currentDir, input, inputRef.current?.selectionStart || input.length);

      if (result.showList && result.matches.length > 0) {
        const promptPath = getPromptPath(currentDir);
        const matchLines = result.matches.map(([name, node]) => ({
          type: node.type,
          text: name,
          clickable: true,
          node
        }));
        setHistory(prev => [...prev, {
          prompt: `${promptPath} $`,
          command: input,
          lines: matchLines,
          isTabList: true
        }]);
        setTabState({ lastInput: input, count: 0 });
      } else if (result.newInput !== input) {
        setInput(result.newInput);
        setTabState({ lastInput: input, count: 0 });
      } else {
        if (tabState.lastInput === input && result.matches.length > 0) {
          const promptPath = getPromptPath(currentDir);
          const matchLines = result.matches.map(([name, node]) => ({
            type: node.type,
            text: name,
            clickable: true,
            node
          }));
          setHistory(prev => [...prev, {
            prompt: `${promptPath} $`,
            command: input,
            lines: matchLines,
            isTabList: true
          }]);
        }
        setTabState({ lastInput: input, count: tabState.count + 1 });
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
      return;
    }

    setTabState({ lastInput: null, count: 0 });
  }, [currentDir, input, commandHistory, historyIndex, tabState]);

  const handleClear = useCallback(() => {
    setHistory([]);
  }, []);

  const promptPath = getPromptPath(currentDir);

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <div className="terminal-header-dots">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
        </div>
        <span className="terminal-header-title">solvers — bash</span>
        <button
          className="terminal-clear-btn"
          onClick={handleClear}
          aria-label="Clear terminal"
          title="Clear"
        >
          Clear
        </button>
      </div>

      <div
        ref={scrollbackRef}
        className="terminal-scrollback"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {history.length === 0 && (
          <div className="terminal-welcome">
            <div className="welcome-line">OpenFOAM Solvers Terminal v1.0</div>
            <div className="welcome-line">Type <span className="welcome-cmd">help</span> for available commands.</div>
            <div className="welcome-line" />
          </div>
        )}

        {history.map((entry, entryIdx) => (
          <div key={entryIdx} className="history-entry">
            {!entry.isTabList && (
              <div className="history-prompt">
                <span className="prompt-path">{entry.prompt}</span>
                <span className="prompt-command"> {entry.command}</span>
              </div>
            )}
            {entry.lines.map((line, lineIdx) => (
              <ScrollbackLine
                key={lineIdx}
                line={line}
                onCommandClick={executeCommand}
              />
            ))}
          </div>
        ))}
      </div>

      <form className="terminal-input-line" onSubmit={handleSubmit}>
        <span className="input-prompt">{promptPath} $</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label="Terminal command input"
        />
        <button
          type="button"
          className="terminal-tab-btn"
          onClick={() => {
            const result = tabComplete(currentDir, input, input.length);
            if (result.newInput !== input) {
              setInput(result.newInput);
            } else if (result.matches.length > 0) {
              const matchLines = result.matches.map(([name, node]) => ({
                type: node.type,
                text: name,
                clickable: true,
                node
              }));
              setHistory(prev => [...prev, {
                prompt: `${promptPath} $`,
                command: input,
                lines: matchLines,
                isTabList: true
              }]);
            }
          }}
          aria-label="Tab completion"
          title="Tab"
        >
          Tab
        </button>
      </form>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════════════ */
export default function SolversSection() {
  const navigate = useNavigate();
  const [pendingCommand, setPendingCommand] = useState(null);

  const handleAccessibleCommand = useCallback((cmd) => {
    setPendingCommand(cmd);
  }, []);

  const handleCommandHandled = useCallback(() => {
    setPendingCommand(null);
  }, []);

  return (
    <div className="solvers-page">
      <CenteredHeader onBack={() => navigate('/hub')} />

      <main className="solvers-main">
        <div className="terminal-layout">
          <TerminalPanel
            externalCommand={pendingCommand}
            onExternalCommandHandled={handleCommandHandled}
          />
          <AccessibleSolverIndex onCommandClick={handleAccessibleCommand} />
        </div>
      </main>
    </div>
  );
}

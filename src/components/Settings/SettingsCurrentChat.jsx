import React from 'react';
import ModelSelector from '../ModelSelector/ModelSelector';
import SystemPromptEditor from '../SystemPromptEditor/SystemPromptEditor';
import { useChatContext } from '../../context/ChatContext';
import { AVAILABLE_MODELS } from '../../config/models';

const SettingsCurrentChat = () => {
  const { selectedModel, setSelectedModel, systemPrompt, setSystemPrompt } = useChatContext();
  
  return (
    <>
      <section className="settings-section">
        <h2 className="section-title">Model</h2>
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          availableModels={AVAILABLE_MODELS}
        />
      </section>
      <section className="settings-section">
        <h2 className="section-title">System Prompt</h2>
        <SystemPromptEditor
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
        />
      </section>
    </>
  );
};

export default SettingsCurrentChat;
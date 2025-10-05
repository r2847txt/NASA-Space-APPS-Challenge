import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Save, Trash2, Upload, AlertTriangle, CheckCircle, Info, Settings, X, Menu, Grid3x3 } from 'lucide-react';

// Definition of habitat components with their properties
const HABITAT_COMPONENTS = {
  privateQuarters: {
    id: 'privateQuarters',
    name: 'Cuartos Privados',
    labelKey: 'comp_privateQuarters',
    type: 'clean',
    volume: 8.5,
    width: 120,
    height: 100,
    color: '#4CAF50',
    icon: '🛏️'
  },
  galley: {
    id: 'galley',
    name: 'Galley/Comedor',
    labelKey: 'comp_galley',
    type: 'clean',
    volume: 12,
    width: 140,
    height: 110,
    color: '#2196F3',
    icon: '🍽️'
  },
  hygiene: {
    id: 'hygiene',
    name: 'Higiene',
    labelKey: 'comp_hygiene',
    type: 'dirty',
    volume: 6,
    width: 100,
    height: 90,
    color: '#FF9800',
    icon: '🚿'
  },
  wcs: {
    id: 'wcs',
    name: 'WCS',
    labelKey: 'comp_wcs',
    type: 'dirty',
    volume: 4,
    width: 80,
    height: 80,
    color: '#F44336',
    icon: '🚽'
  },
  exercise: {
    id: 'exercise',
    name: 'Ejercicio',
    labelKey: 'comp_exercise',
    type: 'dirty',
    volume: 10,
    width: 120,
    height: 120,
    color: '#FF5722',
    icon: '🏋️'
  },
  workstation: {
    id: 'workstation',
    name: 'Estación de Trabajo',
    labelKey: 'comp_workstation',
    type: 'clean',
    volume: 7,
    width: 110,
    height: 100,
    color: '#00BCD4',
    icon: '💻'
  },
  lifeSupport: {
    id: 'lifeSupport',
    name: 'Soporte Vital',
    labelKey: 'comp_lifeSupport',
    type: 'systems',
    volume: 15,
    width: 130,
    height: 120,
    color: '#9C27B0',
    icon: '🌬️'
  },
  commandControl: {
    id: 'commandControl',
    name: 'Comando y Control',
    labelKey: 'comp_commandControl',
    type: 'clean',
    volume: 10,
    width: 140,
    height: 100,
    color: '#3F51B5',
    icon: '🎮'
  },
  storage: {
    id: 'storage',
    name: 'Almacenamiento',
    labelKey: 'comp_storage',
    type: 'neutral',
    volume: 8,
    width: 110,
    height: 110,
    color: '#795548',
    icon: '📦'
  },
  maintenance: {
    id: 'maintenance',
    name: 'Mantenimiento',
    labelKey: 'comp_maintenance',
    type: 'dirty',
    volume: 9,
    width: 120,
    height: 110,
    color: '#FF6F00',
    icon: '🔧'
  },
  airlock: {
    id: 'airlock',
    name: 'Esclusa/Acceso',
    labelKey: 'comp_airlock',
    type: 'dirty',
    volume: 5,
    width: 90,
    height: 100,
    color: '#607D8B',
    icon: '🚪'
  },
  radiationShelter: {
    id: 'radiationShelter',
    name: 'Refugio Radiación',
    labelKey: 'comp_radiationShelter',
    type: 'clean',
    volume: 12,
    width: 130,
    height: 110,
    color: '#FFD700',
    icon: '🛡️'
  },
  medical: {
    id: 'medical',
    name: 'Operaciones Médicas',
    labelKey: 'comp_medical',
    type: 'clean',
    volume: 11,
    width: 130,
    height: 110,
    color: '#E91E63',
    icon: '⚕️'
  }
};

// Snap distance (magnetic alignment)
const SNAP_DISTANCE = 25;

// Translation dictionaries moved to module scope to avoid recreating on every render
const STRINGS = {
  es: {
    title: '🚀 HABiT',
    subtitle: 'Habitat Interactive Tool',
    clear: 'Limpiar',
    save: 'Guardar',
    components: 'Componentes',
    dragHint: 'Arrastra al canvas para agregar →',
    noDesigns: 'No hay diseños guardados',
    saveDialogTitle: 'Guardar Diseño',
    designNamePlaceholder: 'Nombre del diseño',
    cancel: 'Cancelar',
    missionParams: 'Parámetros de Misión',
    toggleGrid: 'Alternar cuadrícula',
    settings: 'Configuración',
    habitability: 'Habitabilidad',
    savedDesignsTitle: 'Diseños Guardados',
    startDesignTitle: '🚀 Comienza tu diseño',
    startDesignHint: 'Arrastra componentes desde el panel izquierdo',
    startDesignSub: 'Los módulos se alinearán automáticamente',
    type_clean: 'Limpio',
    type_dirty: 'Sucio',
    type_systems: 'Sistemas',
    type_neutral: 'Neutral',
    metrics_volume: 'Volumen (NHV)',
    metrics_privacy: 'Privacidad',
    metrics_contamination: 'Contaminación',
    metrics_components: 'Componentes',
    metrics_lifeSupport: '🌬️ Soporte Vital',
    metrics_airlock: '🚪 Esclusa',
    status_comply: 'Cumple',
    status_low: 'Bajo',
    status_ok: 'OK',
    status_alerts: 'Alertas',
    status_installed: 'Instalado',
    status_missing: 'Faltante',
    label_destination: 'Destino',
    label_duration: 'Duración',
    label_crew: 'Tripulación',
    label_geometry: 'Geometría',
    option_moon: '🌙 Luna (Superficie)',
    option_mars: '🔴 Marte (Superficie)',
    option_transit: '🚀 Tránsito (Cislunar/Marte)',
    option_geometry_cyl: 'Cilíndrica',
    option_geometry_hybrid: 'Híbrida (Metálica + Inflable)',
    option_short: 'Corta (≤30 días)',
    option_moderate: 'Moderada (60 días)',
    option_long: 'Larga (180+ días)',
    confirm_delete_design: '¿Estás seguro de eliminar este diseño?',
    confirm_clear_canvas: '¿Limpiar todo el canvas?',
    alert_enter_name: 'Por favor ingresa un nombre para el diseño',
    settings_title: 'Parámetros de Misión',
    comp_privateQuarters: 'Cuartos Privados',
    comp_galley: 'Galley/Comedor',
    comp_hygiene: 'Higiene',
    comp_wcs: 'WCS',
    comp_exercise: 'Ejercicio',
    comp_workstation: 'Estación de Trabajo',
    comp_lifeSupport: 'Soporte Vital',
    comp_commandControl: 'Comando y Control',
    comp_storage: 'Almacenamiento',
    comp_maintenance: 'Mantenimiento',
    comp_airlock: 'Esclusa/Acceso',
    comp_radiationShelter: 'Refugio Radiación',
    comp_medical: 'Operaciones Médicas',
  of_100: 'de 100',
    principle_title: 'Principio',
    principle_text: 'La disposición puede ser más importante que el volumen.'
  },
  en: {
    title: '🚀 HABiT',
    subtitle: 'Habitat Interactive Tool',
    clear: 'Clear',
    save: 'Save',
    components: 'Components',
    dragHint: 'Drag to the canvas to add →',
    noDesigns: 'No saved designs',
    saveDialogTitle: 'Save Design',
    designNamePlaceholder: 'Design name',
    cancel: 'Cancel',
    missionParams: 'Mission Parameters',
    toggleGrid: 'Toggle grid',
    settings: 'Settings',
    habitability: 'Habitability',
    savedDesignsTitle: 'Saved Designs',
    startDesignTitle: '🚀 Start your design',
    startDesignHint: 'Drag components from the left panel',
    startDesignSub: 'Modules will snap automatically',
    type_clean: 'Clean',
    type_dirty: 'Dirty',
    type_systems: 'Systems',
    type_neutral: 'Neutral',
    metrics_volume: 'Volume (NHV)',
    metrics_privacy: 'Privacy',
    metrics_contamination: 'Contamination',
    metrics_components: 'Components',
    metrics_lifeSupport: 'Life Support',
    metrics_airlock: 'Airlock',
    status_comply: 'Compliant',
    status_low: 'Low',
    status_ok: 'OK',
    status_alerts: 'Alerts',
    status_installed: 'Installed',
    status_missing: 'Missing',
    label_destination: 'Destination',
    label_duration: 'Duration',
    label_crew: 'Crew',
    label_geometry: 'Geometry',
    option_moon: '🌙 Moon (Surface)',
    option_mars: '🔴 Mars (Surface)',
    option_transit: '🚀 Transit (Cislunar/Mars)',
    option_geometry_cyl: 'Cylindrical',
    option_geometry_hybrid: 'Hybrid (Metallic + Inflatable)',
    load: 'Load',
    delete: 'Delete',
    toggleLanguage: 'Translate',
    option_short: 'Short (≤30 days)',
    option_moderate: 'Moderate (60 days)',
    option_long: 'Long (180+ days)',
    confirm_delete_design: 'Are you sure you want to delete this design?',
    confirm_clear_canvas: 'Clear the entire canvas?',
    alert_enter_name: 'Please enter a name for the design',
    settings_title: 'Mission Parameters',
    comp_privateQuarters: 'Private Quarters',
    comp_galley: 'Galley / Wardroom',
    comp_hygiene: 'Hygiene',
    comp_wcs: 'WCS',
    comp_exercise: 'Exercise',
    comp_workstation: 'Workstation',
    comp_lifeSupport: 'Life Support',
    comp_commandControl: 'Command & Control',
    comp_storage: 'Storage',
    comp_maintenance: 'Maintenance',
    comp_airlock: 'Airlock',
    comp_radiationShelter: 'Radiation Shelter',
    comp_medical: 'Medical Operations',
    of_100: 'of 100',
    principle_title: 'Principle',
    principle_text: 'Layout can be more important than volume.'
  }
};

const getString = (lang, key) => (STRINGS[lang] && STRINGS[lang][key]) || key;

function App() {
  const [missionParams, setMissionParams] = useState({
    destination: 'luna',
    duration: 'corta',
    crewSize: 4,
    geometry: 'cilindrica'
  });

  const [lang, setLang] = useState('en');
  // stable translation helper
  const t = useCallback((key) => getString(lang, key), [lang]);

  const [placedComponents, setPlacedComponents] = useState([]);
  const [draggedComponent, setDraggedComponent] = useState(null);
  const [isDraggingExisting, setIsDraggingExisting] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [designName, setDesignName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  // UI state flags
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('habitatDesigns') || '[]');
    setSavedDesigns(saved);
  }, []);

  const findSnapPosition = (x, y, width, height, excludeId = null) => {
    let snappedX = x;
    let snappedY = y;
    let minDistanceX = SNAP_DISTANCE;
    let minDistanceY = SNAP_DISTANCE;

    placedComponents.forEach(comp => {
      if (comp.id === excludeId) return;
      
      const compData = HABITAT_COMPONENTS[comp.type];
      
      const edges = [
        { pos: comp.x, snap: comp.x },
        { pos: comp.x + compData.width, snap: comp.x + compData.width },
        { pos: comp.x + compData.width, snap: comp.x + compData.width - width },
        { pos: comp.x + compData.width/2, snap: comp.x + compData.width/2 - width/2 }
      ];

      edges.forEach(edge => {
        const distLeft = Math.abs(x - edge.pos);
        const distRight = Math.abs((x + width) - edge.pos);
        
        if (distLeft < minDistanceX) {
          minDistanceX = distLeft;
          snappedX = edge.snap;
        }
        if (distRight < minDistanceX) {
          minDistanceX = distRight;
          snappedX = edge.pos - width;
        }
      });

      const vEdges = [
        { pos: comp.y, snap: comp.y },
        { pos: comp.y + compData.height, snap: comp.y + compData.height },
        { pos: comp.y + compData.height, snap: comp.y + compData.height - height },
        { pos: comp.y + compData.height/2, snap: comp.y + compData.height/2 - height/2 }
      ];

      vEdges.forEach(edge => {
        const distTop = Math.abs(y - edge.pos);
        const distBottom = Math.abs((y + height) - edge.pos);
        
        if (distTop < minDistanceY) {
          minDistanceY = distTop;
          snappedY = edge.snap;
        }
        if (distBottom < minDistanceY) {
          minDistanceY = distBottom;
          snappedY = edge.pos - height;
        }
      });
    });

    return {
      x: minDistanceX < SNAP_DISTANCE ? snappedX : x,
      y: minDistanceY < SNAP_DISTANCE ? snappedY : y
    };
  };

  const calculateMetrics = () => {
    const minNHV = missionParams.crewSize * (missionParams.duration === 'larga' ? 28 : 20);
    const currentNHV = placedComponents.reduce((sum, comp) => sum + HABITAT_COMPONENTS[comp.type].volume, 0);
    
    const contaminations = [];
    placedComponents.forEach((comp, idx) => {
      const compData = HABITAT_COMPONENTS[comp.type];
      placedComponents.forEach((other, otherIdx) => {
        if (idx !== otherIdx) {
          const otherData = HABITAT_COMPONENTS[other.type];
          const distance = Math.sqrt(
            Math.pow(comp.x - other.x, 2) + Math.pow(comp.y - other.y, 2)
          );
          
          // If they are too close and types are incompatible
          if (distance < 150) {
            if ((compData.type === 'clean' && otherData.type === 'dirty') ||
                (compData.type === 'dirty' && otherData.type === 'clean')) {
              contaminations.push({
                comp1: compData.name,
                comp2: otherData.name
              });
            }
          }
        }
      });
    });

    const privateQuarters = placedComponents.filter(c => c.type === 'privateQuarters');
    const publicAreas = placedComponents.filter(c => ['galley', 'workstation'].includes(c.type));
    
    let privacyScore = 100;
    privateQuarters.forEach(pq => {
      publicAreas.forEach(pa => {
        const distance = Math.sqrt(Math.pow(pq.x - pa.x, 2) + Math.pow(pq.y - pa.y, 2));
        if (distance < 200) privacyScore -= 20;
      });
    });

  // Check critical components
    const hasLifeSupport = placedComponents.some(c => c.type === 'lifeSupport');
    const hasAirlock = placedComponents.some(c => c.type === 'airlock');
    const hasMedical = placedComponents.some(c => c.type === 'medical');
    const hasSPECapability = placedComponents.some(c => ['privateQuarters', 'galley', 'radiationShelter'].includes(c.type));
    const hasStorage = placedComponents.some(c => c.type === 'storage');
    const hasCommandControl = placedComponents.some(c => c.type === 'commandControl');
    
  // HABITABILITY SCORE CALCULATION (0-100)
    let habitabilityScore = 0;
    
  // 1. Adequate volume (20 points)
    if (currentNHV >= minNHV) {
      habitabilityScore += 20;
    } else {
      habitabilityScore += Math.min(20, (currentNHV / minNHV) * 20);
    }
    
  // 2. Privacy (15 points)
    habitabilityScore += (privacyScore / 100) * 15;
    
  // 3. No cross-contamination (20 points)
    const contaminationPenalty = Math.min(20, contaminations.length * 5);
    habitabilityScore += (20 - contaminationPenalty);
    
  // 4. Critical components (30 points total)
    if (hasLifeSupport) habitabilityScore += 10;
    if (hasAirlock) habitabilityScore += 8;
    if (hasMedical) habitabilityScore += 6;
    if (hasSPECapability) habitabilityScore += 6;
    
  // 5. Complementary components (10 points)
    if (hasStorage) habitabilityScore += 5;
    if (hasCommandControl) habitabilityScore += 5;
    
  // 6. Component balance (5 points)
    const hasBasicNeeds = placedComponents.some(c => c.type === 'galley') &&
                          placedComponents.some(c => c.type === 'hygiene') &&
                          placedComponents.some(c => c.type === 'privateQuarters');
    if (hasBasicNeeds) habitabilityScore += 5;
    
    habitabilityScore = Math.round(Math.min(100, Math.max(0, habitabilityScore)));

    return {
      minNHV,
      currentNHV,
      nhvCompliance: currentNHV >= minNHV,
      contaminations: [...new Set(contaminations.map(c => `${c.comp1} ↔ ${c.comp2}`))],
      privacyScore: Math.max(0, privacyScore),
      hasSPECapability,
      hasLifeSupport,
      hasAirlock,
      hasMedical,
      hasStorage,
      hasCommandControl,
      habitabilityScore
    };
  };

  // memoize metrics to avoid recalculation on unrelated state changes
  const metrics = useMemo(() => calculateMetrics(), [placedComponents, missionParams]);

  const handleDragStart = (componentType, e) => {
    e.dataTransfer.effectAllowed = 'copy';
    setDraggedComponent(componentType);
    setIsDraggingExisting(false);
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    if (!draggedComponent || isDraggingExisting) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left - 50;
    let y = e.clientY - rect.top - 50;

    const compData = HABITAT_COMPONENTS[draggedComponent];
    
    const snapped = findSnapPosition(x, y, compData.width, compData.height);
    x = snapped.x;
    y = snapped.y;

    x = Math.max(0, Math.min(x, rect.width - compData.width));
    y = Math.max(0, Math.min(y, rect.height - compData.height));

    const newComponent = {
      id: Date.now(),
      type: draggedComponent,
      x,
      y
    };

    setPlacedComponents([...placedComponents, newComponent]);
    setDraggedComponent(null);
    setSelectedComponent(newComponent.id);
  };

  const handleComponentMouseDown = (componentId, e) => {
    e.stopPropagation();
    setSelectedComponent(componentId);
    const component = placedComponents.find(c => c.id === componentId);
    if (!component) return;
    
    setDraggedComponent(component);
    setIsDraggingExisting(true);
    
    const compElement = e.currentTarget;
    const rect = compElement.getBoundingClientRect();
    
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!draggedComponent || !isDraggingExisting || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let x = e.clientX - rect.left - dragOffset.x;
    let y = e.clientY - rect.top - dragOffset.y;

    const compData = HABITAT_COMPONENTS[draggedComponent.type];
    
    const snapped = findSnapPosition(x, y, compData.width, compData.height, draggedComponent.id);
    x = snapped.x;
    y = snapped.y;

    x = Math.max(0, Math.min(x, rect.width - compData.width));
    y = Math.max(0, Math.min(y, rect.height - compData.height));

    setPlacedComponents(placedComponents.map(comp => 
      comp.id === draggedComponent.id
        ? { ...comp, x, y }
        : comp
    ));
  };

  const handleMouseUp = () => {
    if (isDraggingExisting) {
      setDraggedComponent(null);
      setIsDraggingExisting(false);
    }
  };

  const removeComponent = (componentId) => {
    setPlacedComponents(placedComponents.filter(c => c.id !== componentId));
    setSelectedComponent(null);
  };

  const saveDesign = () => {
    if (!designName.trim()) {
      alert(t('alert_enter_name'));
      return;
    }

    const design = {
      id: Date.now(),
      name: designName,
      date: new Date().toISOString(),
      missionParams,
      placedComponents,
      metrics
    };

    const updated = [...savedDesigns, design];
    setSavedDesigns(updated);
    localStorage.setItem('habitatDesigns', JSON.stringify(updated));
    
    setDesignName('');
    setShowSaveDialog(false);
  };

  const loadDesign = (design) => {
    setMissionParams(design.missionParams);
    setPlacedComponents(design.placedComponents);
    setShowSidebar(false);
  };

  const deleteDesign = (designId) => {
    if (!confirm(t('confirm_delete_design'))) return;
    
    const updated = savedDesigns.filter(d => d.id !== designId);
    setSavedDesigns(updated);
    localStorage.setItem('habitatDesigns', JSON.stringify(updated));
  };

  const clearCanvas = () => {
    if (confirm(t('confirm_clear_canvas'))) {
      setPlacedComponents([]);
      setSelectedComponent(null);
    }
  };

  const getCanvasBackground = () => {
    switch(missionParams.destination) {
      case 'luna':
        return {
          background: 'radial-gradient(ellipse at bottom, #1a1a2e 0%, #0f0f1e 100%)',
          backgroundImage: `
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(circle at 50% 80%, #4a4a5a 0%, transparent 50%)
          `,
          borderColor: '#4a4a5a'
        };
      case 'marte':
        return {
          background: 'linear-gradient(180deg, #1a0f0a 0%, #3d1f14 50%, #5c2e1f 100%)',
          backgroundImage: `
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(1px 1px at 60% 70%, white, transparent),
            radial-gradient(circle at 30% 70%, rgba(139, 69, 19, 0.3) 0%, transparent 50%)
          `,
          borderColor: '#8b4513'
        };
      case 'transito':
        return {
          background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)',
          backgroundImage: `
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent)
          `,
          borderColor: '#1a1a3a'
        };
      default:
        return {
          background: '#1a1a2e',
          borderColor: '#4a4a5a'
        };
    }
  };

  const canvasStyle = getCanvasBackground();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
  {/* Compact, responsive header */}
      <header className="bg-gray-900 bg-opacity-90 backdrop-blur-sm border-b border-gray-700 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
            <div className="max-w-full mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-800 rounded"
            >
              <Menu size={20} className="sm:w-6 sm:h-6" />
            </button>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('title')}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">{t('subtitle')}</p>
            </div>
          </div>
          
          {/* Puntuación de Habitabilidad - Responsive */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg px-3 sm:px-6 py-1.5 sm:py-2 border-2 border-blue-500 shadow-lg">
            <div className="text-xs text-gray-300 mb-0.5 sm:mb-1 text-center hidden sm:block">{t('habitability')}</div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-xl sm:text-3xl font-bold" style={{
                  color: metrics.habitabilityScore >= 80 ? '#4CAF50' :
                         metrics.habitabilityScore >= 60 ? '#FFC107' :
                         metrics.habitabilityScore >= 40 ? '#FF9800' : '#F44336'
                }}>
                  {metrics.habitabilityScore}
                </div>
                <div>
                  <div className="text-xs text-gray-400">{t('of_100')}</div>
                  
                  <div className="w-12 sm:w-20 bg-gray-700 rounded-full h-1.5 sm:h-2 mt-0.5 sm:mt-1">
                    <div 
                      className="h-1.5 sm:h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${metrics.habitabilityScore}%`,
                        backgroundColor: metrics.habitabilityScore >= 80 ? '#4CAF50' :
                                       metrics.habitabilityScore >= 60 ? '#FFC107' :
                                       metrics.habitabilityScore >= 40 ? '#FF9800' : '#F44336'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 sm:p-2 rounded transition ${showGrid ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              title={t('toggleGrid')}
            >
              <Grid3x3 size={16} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-600 rounded transition flex items-center gap-2"
              title={t('settings')}
            >
              <Settings size={16} className="sm:w-5 sm:h-5" />
              {/* Language toggle moved next to settings */}
              <button
                onClick={(e) => { e.stopPropagation(); setLang(lang === 'es' ? 'en' : 'es'); }}
                className="ml-2 bg-white bg-opacity-10 text-white px-2 py-1 rounded-md hover:bg-opacity-20 text-xs"
                title={t('toggleLanguage')}
              >
                {lang === 'es' ? 'ES' : 'EN'}
              </button>
            </button>
            <button
              onClick={clearCanvas}
              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 rounded transition flex items-center gap-1 sm:gap-2"
            >
              <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline text-sm">{t('clear')}</span>
            </button>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 rounded transition flex items-center gap-1 sm:gap-2"
            >
              <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline text-sm">{t('save')}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
  {/* Left sidebar - Components */}
          <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-800 border-r border-gray-700 overflow-hidden flex-shrink-0`}>
          <div className="p-4 h-full overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 flex items-center justify-between">
              {t('components')}
              <button
                onClick={() => setShowSidebar(false)}
                className="lg:hidden p-1 hover:bg-gray-700 rounded"
              >
                <X size={18} />
              </button>
            </h2>
            <p className="text-xs text-gray-400 mb-4">{t('dragHint')}</p>
            
            <div className="space-y-2">
              {Object.values(HABITAT_COMPONENTS).map((comp) => (
                <div
                  key={comp.id}
                  draggable
                  onDragStart={(e) => handleDragStart(comp.id, e)}
                  className="bg-gray-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-gray-600 transition border-l-4 transform hover:scale-105"
                  style={{ borderLeftColor: comp.color }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{comp.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{t(comp.labelKey)}</div>
                      <span className="text-xs text-gray-400">{comp.volume}m³</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded ${
                      comp.type === 'clean' ? 'bg-green-600' : 
                      comp.type === 'dirty' ? 'bg-red-600' : 
                      comp.type === 'systems' ? 'bg-purple-600' : 
                      'bg-gray-600'
                    }`}>
                      {comp.type === 'clean' ? t('type_clean') : 
                       comp.type === 'dirty' ? t('type_dirty') : 
                       comp.type === 'systems' ? t('type_systems') : 
                       t('type_neutral')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Saved designs in sidebar */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2 text-gray-300">{t('savedDesignsTitle')}</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedDesigns.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">
                    {t('noDesigns')}
                  </p>
                ) : (
                  savedDesigns.map((design) => (
                    <div key={design.id} className="bg-gray-700 rounded p-2 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{design.name}</div>
                          <div className="text-gray-400">
                            {new Date(design.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => loadDesign(design)}
                            className="p-1 bg-blue-600 hover:bg-blue-700 rounded"
                            title={t('load')}
                          >
                            <Upload size={12} />
                          </button>
                          <button
                            onClick={() => deleteDesign(design.id)}
                            className="p-1 bg-red-600 hover:bg-red-700 rounded"
                            title={t('delete')}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

  {/* Main canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto h-full">
              <div
                ref={canvasRef}
                className="relative rounded-lg border-2 overflow-hidden h-full min-h-[600px]"
                style={{ 
                  background: canvasStyle.background,
                  backgroundImage: showGrid ? 
                    `repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px),
                     repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px),
                     ${canvasStyle.backgroundImage}` : canvasStyle.backgroundImage,
                  backgroundSize: showGrid ? '40px 40px, 40px 40px, 200% 200%' : canvasStyle.backgroundSize,
                  borderColor: canvasStyle.borderColor
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleCanvasDrop}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={() => setSelectedComponent(null)}
              >
                {placedComponents.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center px-4 pointer-events-none">
                    <div>
                      <div className="text-2xl mb-3">{t('startDesignTitle')}</div>
                      <div className="text-sm">{t('startDesignHint')}</div>
                      <div className="text-xs text-gray-500 mt-2">{t('startDesignSub')}</div>
                    </div>
                  </div>
                )}

                {placedComponents.map((comp) => {
                  const compData = HABITAT_COMPONENTS[comp.type];
                  const isSelected = selectedComponent === comp.id;
                  return (
                    <div
                      key={comp.id}
                      className={`absolute cursor-move rounded-lg border-2 flex flex-col items-center justify-center p-3 transition-all ${
                        isSelected ? 'ring-4 ring-white ring-opacity-50 z-10' : 'hover:scale-105'
                      }`}
                      style={{
                        left: comp.x,
                        top: comp.y,
                        width: compData.width,
                        height: compData.height,
                        backgroundColor: compData.color + 'DD',
                        borderColor: isSelected ? 'white' : compData.color,
                        boxShadow: isSelected 
                          ? `0 0 30px ${compData.color}, inset 0 0 20px rgba(255,255,255,0.2)`
                          : `0 4px 15px ${compData.color}88, inset 0 0 20px rgba(255,255,255,0.1)`
                      }}
                      onMouseDown={(e) => handleComponentMouseDown(comp.id, e)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComponent(comp.id);
                      }}
                    >
                      <div className="text-xl mb-1">{compData.icon}</div>
                      <div className="text-xs font-bold text-white drop-shadow-lg text-center leading-tight">
                        {t(compData.labelKey)}
                      </div>
                      <div className="text-xs text-white opacity-80 mt-1">
                        {compData.volume}m³
                      </div>
                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeComponent(comp.id);
                          }}
                          className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 rounded-full p-1.5 shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom metrics panel */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="bg-gray-700 rounded p-3">
              <div className="text-xs text-gray-400 mb-1">{t('metrics_volume')}</div>
                  <div className="text-lg font-bold">{metrics.currentNHV.toFixed(1)}m³</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {metrics.nhvCompliance ? (
                      <><CheckCircle size={12} className="text-green-400" /> <span className="text-green-400">{t('status_comply')}</span></>
                    ) : (
                      <><AlertTriangle size={12} className="text-red-400" /> <span className="text-red-400">{t('status_low')}</span></>
                    )}
                  </div>
                </div>

                <div className="bg-gray-700 rounded p-3">
                  <div className="text-xs text-gray-400 mb-1">{t('metrics_privacy')}</div>
                  <div className="text-lg font-bold">{metrics.privacyScore}%</div>
                  <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${metrics.privacyScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded p-3">
                  <div className="text-xs text-gray-400 mb-1">{t('metrics_contamination')}</div>
                  <div className="text-lg font-bold">{metrics.contaminations.length}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {metrics.contaminations.length === 0 ? (
                      <><CheckCircle size={12} className="text-green-400" /> <span className="text-green-400">{t('status_ok')}</span></>
                    ) : (
                      <><AlertTriangle size={12} className="text-yellow-400" /> <span className="text-yellow-400">{t('status_alerts')}</span></>
                    )}
                  </div>
                </div>

                <div className="bg-gray-700 rounded p-3">
                  <div className="text-xs text-gray-400 mb-1">{t('metrics_components')}</div>
                  <div className="text-lg font-bold">{placedComponents.length}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {t('label_crew')}: {missionParams.crewSize}
                  </div>
                </div>

                <div className="bg-gray-700 rounded p-3">
                  <div className="text-xs text-gray-400 mb-1">{t('metrics_lifeSupport')}</div>
                  <div className="text-sm font-bold mt-1">
                    {metrics.hasLifeSupport ? (
                      <span className="text-green-400 flex items-center gap-1">
                        <CheckCircle size={14} /> {t('status_installed')}
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1">
                        <AlertTriangle size={14} /> {t('status_missing')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-700 rounded p-3">
                  <div className="text-xs text-gray-400 mb-1">{t('metrics_airlock')}</div>
                  <div className="text-sm font-bold mt-1">
                    {metrics.hasAirlock ? (
                      <span className="text-green-400 flex items-center gap-1">
                        <CheckCircle size={14} /> {t('status_ok')}
                      </span>
                    ) : (
                      <span className="text-yellow-400 flex items-center gap-1">
                        <AlertTriangle size={14} /> {t('status_missing')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t('settings_title')}</h2>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-700 rounded">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('label_destination')}</label>
                <select 
                  className="w-full bg-gray-700 rounded px-3 py-2 border border-gray-600"
                  value={missionParams.destination}
                  onChange={(e) => setMissionParams({...missionParams, destination: e.target.value})}
                >
                  <option value="luna">{t('option_moon')}</option>
                  <option value="marte">{t('option_mars')}</option>
                  <option value="transito">{t('option_transit')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('label_duration')}</label>
                <select 
                  className="w-full bg-gray-700 rounded px-3 py-2 border border-gray-600"
                  value={missionParams.duration}
                  onChange={(e) => setMissionParams({...missionParams, duration: e.target.value})}
                >
                  <option value="corta">{t('option_short')}</option>
                  <option value="moderada">{t('option_moderate')}</option>
                  <option value="larga">{t('option_long')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('label_crew')}: {missionParams.crewSize}</label>
                <input 
                  type="range" 
                  min="2" 
                  max="8"
                  className="w-full"
                  value={missionParams.crewSize}
                  onChange={(e) => setMissionParams({...missionParams, crewSize: parseInt(e.target.value)})}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>2</span>
                  <span>8</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('label_geometry')}</label>
                <select 
                  className="w-full bg-gray-700 rounded px-3 py-2 border border-gray-600"
                  value={missionParams.geometry}
                  onChange={(e) => setMissionParams({...missionParams, geometry: e.target.value})}
                >
                  <option value="cilindrica">{t('option_geometry_cyl')}</option>
                  <option value="hibrida">{t('option_geometry_hybrid')}</option>
                </select>
              </div>

              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded p-3 text-sm">
                  <div className="flex items-start gap-2">
                  <Info size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>{t('principle_title')}:</strong> {t('principle_text')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

  {/* Save modal */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">{t('saveDialogTitle')}</h2>
            <input
              type="text"
              placeholder={t('designNamePlaceholder')}
              className="w-full bg-gray-700 rounded px-3 py-2 mb-4 border border-gray-600"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={saveDesign}
                className="flex-1 bg-green-600 hover:bg-green-700 rounded px-4 py-2 transition"
              >
                {t('save')}
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 rounded px-4 py-2 transition"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
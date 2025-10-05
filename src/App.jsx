import React, { useState, createContext, useContext } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

// ============================================
// CONTEXTO GLOBAL PARA GESTIONAR EL ESTADO
// ============================================
const HabitatContext = createContext();

const useHabitat = () => {
  const context = useContext(HabitatContext);
  if (!context) {
    throw new Error('useHabitat debe usarse dentro de HabitatProvider');
  }
  return context;
};

// ============================================
// DATOS DE MÓDULOS Y RESTRICCIONES
// ============================================
const MODULE_TYPES = {
  CREW_QUARTERS: {
    id: 'crew_quarters',
    name: 'Cuarto de Tripulación',
    minVolume: 3.5, // m³ mínimo por cuarto
    width: 2,
    height: 2,
    isClean: true,
    color: 'bg-blue-400'
  },
  GALLEY: {
    id: 'galley',
    name: 'Galley/Wardroom',
    minVolume: 8,
    width: 3,
    height: 2,
    isClean: true,
    color: 'bg-green-400'
  },
  HYGIENE: {
    id: 'hygiene',
    name: 'Estación de Higiene',
    minVolume: 2,
    width: 2,
    height: 1,
    isClean: false,
    color: 'bg-yellow-600'
  },
  WCS: {
    id: 'wcs',
    name: 'Sistema de Residuos (WCS)',
    minVolume: 1.5,
    width: 1,
    height: 1,
    isClean: false,
    color: 'bg-red-600'
  },
  EXERCISE: {
    id: 'exercise',
    name: 'Área de Ejercicio',
    minVolume: 4,
    width: 2,
    height: 2,
    isClean: false,
    color: 'bg-orange-500'
  },
  WORKSTATION: {
    id: 'workstation',
    name: 'Estación de Trabajo',
    minVolume: 3,
    width: 2,
    height: 2,
    isClean: true,
    color: 'bg-purple-400'
  }
};

// ============================================
// COMPONENTE: CONFIGURACIÓN DE MISIÓN
// ============================================
function MissionSetup() {
  const { missionParams, setMissionParams } = useHabitat();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        📋 Configuración de Misión
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destino */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Destino:
          </label>
          <select
            value={missionParams.destination}
            onChange={(e) => setMissionParams({...missionParams, destination: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="moon">Luna (Superficie)</option>
            <option value="mars">Marte (Superficie)</option>
            <option value="transit">Tránsito (Cislunar/Marte)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Impacta ISRU y gestión de polvo
          </p>
        </div>

        {/* Duración */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Duración de la Misión:
          </label>
          <select
            value={missionParams.duration}
            onChange={(e) => setMissionParams({...missionParams, duration: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="short">Corta (≤30 días)</option>
            <option value="moderate">Moderada (60 días)</option>
            <option value="long">Larga (180+ días)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Misiones largas requieren cuartos privados permanentes
          </p>
        </div>

        {/* Tripulación */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Número de Tripulantes:
          </label>
          <input
            type="number"
            min="2"
            max="8"
            value={missionParams.crewSize}
            onChange={(e) => setMissionParams({...missionParams, crewSize: parseInt(e.target.value)})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            ~28-29 m³/tripulante (mínimo teórico)
          </p>
        </div>

        {/* Geometría */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Geometría del Hábitat:
          </label>
          <select
            value={missionParams.geometry}
            onChange={(e) => setMissionParams({...missionParams, geometry: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="cylindrical">Cilíndrica (Estándar)</option>
            <option value="hybrid">Híbrida (Metálica + Inflable)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Debe caber en carenado de 8.4m
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: LIENZO DE DISEÑO
// ============================================
function DesignCanvas() {
  const { modules, setModules, checkContamination } = useHabitat();
  const [selectedType, setSelectedType] = useState('crew_quarters');
  const [draggedModule, setDraggedModule] = useState(null);

  // Función para agregar un módulo al canvas
  const addModule = () => {
    const moduleType = MODULE_TYPES[selectedType.toUpperCase()];
    const newModule = {
      id: Date.now(),
      type: selectedType,
      ...moduleType,
      x: Math.floor(Math.random() * 6),
      y: Math.floor(Math.random() * 6)
    };
    setModules([...modules, newModule]);
  };

  // Función para mover un módulo
  const moveModule = (id, direction) => {
    setModules(modules.map(mod => {
      if (mod.id === id) {
        let newX = mod.x;
        let newY = mod.y;
        
        if (direction === 'up') newY = Math.max(0, mod.y - 1);
        if (direction === 'down') newY = Math.min(7, mod.y + 1);
        if (direction === 'left') newX = Math.max(0, mod.x - 1);
        if (direction === 'right') newX = Math.min(7, mod.x + 1);
        
        return { ...mod, x: newX, y: newY };
      }
      return mod;
    }));
  };

  // Función para eliminar un módulo
  const removeModule = (id) => {
    setModules(modules.filter(mod => mod.id !== id));
  };

  // ===== FUNCIONES DRAG AND DROP =====
  
  // Inicia el arrastre de un módulo
  const handleDragStart = (e, module) => {
    setDraggedModule(module);
    e.dataTransfer.effectAllowed = 'move';
    // Agregar estilo visual al elemento arrastrado
    e.target.style.opacity = '0.5';
  };

  // Finaliza el arrastre
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedModule(null);
  };

  // Permite soltar en una celda
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Maneja el evento de soltar en una celda
  const handleDrop = (e, targetX, targetY) => {
    e.preventDefault();
    
    if (!draggedModule) return;

    // Verificar que la celda objetivo esté libre
    const cellOccupied = modules.some(
      mod => mod.id !== draggedModule.id && mod.x === targetX && mod.y === targetY
    );

    if (!cellOccupied) {
      // Actualizar la posición del módulo arrastrado
      setModules(modules.map(mod => 
        mod.id === draggedModule.id 
          ? { ...mod, x: targetX, y: targetY }
          : mod
      ));
    }
    
    setDraggedModule(null);
  };

  // Resalta la celda cuando se arrastra sobre ella
  const handleDragEnter = (e) => {
    e.currentTarget.classList.add('bg-blue-100');
  };

  // Remueve el resaltado cuando se sale de la celda
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-blue-100');
  };

  const contaminations = checkContamination();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">
          🏗️ Lienzo de Diseño
        </h2>
      </div>

      {/* MENSAJE EDUCATIVO CLAVE */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="font-bold text-blue-900 mb-2">
          ⚠️ PRINCIPIO RECTOR DEL DISEÑO:
        </p>
        <p className="text-blue-800 mb-2">
          <strong>La disposición puede ser más importante que el volumen.</strong> Un hábitat 
          con menor volumen pero una disposición adecuada (Properly Laid Out) es preferible 
          a uno grande con disposición deficiente.
        </p>
        <p className="text-sm text-blue-700 mt-2">
          💡 <strong>Tip:</strong> Arrastra los módulos directamente en el grid para posicionarlos, 
          o usa las flechas para movimientos precisos.
        </p>
      </div>

      {/* Controles para agregar módulos */}
      <div className="mb-4 flex gap-2 items-center">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          {Object.keys(MODULE_TYPES).map(key => (
            <option key={key} value={key.toLowerCase()}>
              {MODULE_TYPES[key].name}
            </option>
          ))}
        </select>
        <button
          onClick={addModule}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Agregar Módulo
        </button>
      </div>

      {/* Leyenda de zonas */}
      <div className="mb-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 border border-blue-400"></div>
          <span>Zonas Limpias (Clean)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 border border-red-400"></div>
          <span>Zonas Sucias (Dirty)</span>
        </div>
      </div>

      {/* Grid de diseño (8x8 simplificado) */}
      <div className="grid grid-cols-8 gap-1 bg-gray-200 p-2 rounded-lg mb-4" style={{minHeight: '400px'}}>
        {Array.from({length: 64}).map((_, idx) => {
          const x = idx % 8;
          const y = Math.floor(idx / 8);
          const moduleHere = modules.find(m => m.x === x && m.y === y);
          
          return (
            <div
              key={idx}
              className={`border border-gray-300 rounded ${
                moduleHere 
                  ? moduleHere.color 
                  : 'bg-white'
              } relative flex items-center justify-center transition-colors duration-150`}
              style={{aspectRatio: '1/1'}}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, x, y)}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              {moduleHere && (
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center p-1 cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, moduleHere)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="text-xs font-bold text-white text-center pointer-events-none" style={{fontSize: '0.6rem'}}>
                    {moduleHere.name.split(' ')[0]}
                  </span>
                  <div className="flex gap-1 mt-1 pointer-events-auto">
                    <button
                      onClick={() => moveModule(moduleHere.id, 'up')}
                      className="bg-white bg-opacity-50 px-1 text-xs rounded hover:bg-opacity-75"
                      title="Arriba"
                    >↑</button>
                    <button
                      onClick={() => moveModule(moduleHere.id, 'down')}
                      className="bg-white bg-opacity-50 px-1 text-xs rounded hover:bg-opacity-75"
                      title="Abajo"
                    >↓</button>
                    <button
                      onClick={() => moveModule(moduleHere.id, 'left')}
                      className="bg-white bg-opacity-50 px-1 text-xs rounded hover:bg-opacity-75"
                      title="Izquierda"
                    >←</button>
                    <button
                      onClick={() => moveModule(moduleHere.id, 'right')}
                      className="bg-white bg-opacity-50 px-1 text-xs rounded hover:bg-opacity-75"
                      title="Derecha"
                    >→</button>
                  </div>
                  <button
                    onClick={() => removeModule(moduleHere.id)}
                    className="bg-red-500 text-white px-1 text-xs rounded mt-1 hover:bg-red-600 pointer-events-auto"
                  >✕</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Alertas de contaminación cruzada */}
      {contaminations.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-600" size={20} />
            <h3 className="font-bold text-red-900">⚠️ ALERTAS DE RIESGO DE CONTAMINACIÓN</h3>
          </div>
          <ul className="list-disc list-inside text-red-800">
            {contaminations.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE: MÉTRICAS DE HABITABILIDAD
// ============================================
function HabitabilityMetrics() {
  const { missionParams, modules, calculateMetrics } = useHabitat();
  const metrics = calculateMetrics();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        📊 Evaluación de Habitabilidad
      </h2>

      <div className="space-y-4">
        {/* Volumen Habitable Neto (NHV) */}
        <div className="border-b pb-4">
          <h3 className="font-bold text-lg mb-2">Volumen Habitable Neto (NHV)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">NHV Mínimo Requerido:</p>
              <p className="text-xl font-bold text-blue-600">
                {metrics.minNHV.toFixed(1)} m³
              </p>
              <p className="text-xs text-gray-500">
                (28 m³ × {missionParams.crewSize} tripulantes)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">NHV Actual del Diseño:</p>
              <p className="text-xl font-bold text-green-600">
                {metrics.actualNHV.toFixed(1)} m³
              </p>
              <p className="text-xs text-gray-500">
                ~{(metrics.actualNHV / missionParams.crewSize).toFixed(1)} m³/tripulante
              </p>
            </div>
          </div>
          <div className="mt-2">
            {metrics.nhvStatus === 'sufficient' ? (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={20} />
                <span>✓ Volumen suficiente para la tripulación</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle size={20} />
                <span>✗ Volumen insuficiente - Agregar más módulos</span>
              </div>
            )}
          </div>
        </div>

        {/* Privacidad */}
        <div className="border-b pb-4">
          <h3 className="font-bold text-lg mb-2">Privacidad</h3>
          <p className="text-sm text-gray-600 mb-2">
            Cuartos privados: {metrics.crewQuarters} / {missionParams.crewSize} requeridos
          </p>
          {metrics.privacyStatus === 'adequate' ? (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle size={20} />
              <span>✓ Privacidad adecuada para misión {missionParams.duration}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle size={20} />
              <span>⚠ Se requieren más cuartos privados para misiones largas</span>
            </div>
          )}
        </div>

        {/* Separación Funcional */}
        <div className="border-b pb-4">
          <h3 className="font-bold text-lg mb-2">Separación Funcional</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm">Zonas Limpias: {metrics.cleanZones} módulos</p>
              <p className="text-xs text-gray-500">
                (Cuartos, Galley, Workstation)
              </p>
            </div>
            <div>
              <p className="text-sm">Zonas Sucias: {metrics.dirtyZones} módulos</p>
              <p className="text-xs text-gray-500">
                (WCS, Higiene, Ejercicio)
              </p>
            </div>
            {metrics.separationStatus === 'good' ? (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={20} />
                <span>✓ Separación adecuada de zonas</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle size={20} />
                <span>✗ Riesgo de contaminación cruzada detectado</span>
              </div>
            )}
          </div>
        </div>

        {/* Masa Estimada */}
        <div>
          <h3 className="font-bold text-lg mb-2">Masa Estimada del Sistema</h3>
          <p className="text-xl font-bold text-purple-600">
            {metrics.estimatedMass.toFixed(0)} kg
          </p>
          <p className="text-xs text-gray-500">
            Estimación basada en volumen y número de módulos
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL: APP
// ============================================
function App() {
  // Estado global de la aplicación
  const [missionParams, setMissionParams] = useState({
    destination: 'moon',
    duration: 'moderate',
    crewSize: 4,
    geometry: 'cylindrical'
  });

  const [modules, setModules] = useState([]);

  // Función para verificar contaminación cruzada
  const checkContamination = () => {
    const warnings = [];
    
    // Verificar adyacencia entre módulos limpios y sucios
    modules.forEach(mod1 => {
      modules.forEach(mod2 => {
        if (mod1.id !== mod2.id && mod1.isClean !== mod2.isClean) {
          // Verificar si son adyacentes (en las 4 direcciones)
          const isAdjacent = 
            (Math.abs(mod1.x - mod2.x) === 1 && mod1.y === mod2.y) ||
            (Math.abs(mod1.y - mod2.y) === 1 && mod1.x === mod2.x);
          
          if (isAdjacent) {
            warnings.push(
              `RIESGO: ${mod1.name} (${mod1.isClean ? 'Limpia' : 'Sucia'}) está adyacente a ${mod2.name} (${mod2.isClean ? 'Limpia' : 'Sucia'})`
            );
          }
        }
      });
    });

    return warnings;
  };

  // Función para calcular métricas de habitabilidad
  const calculateMetrics = () => {
    // Calcular NHV mínimo requerido (28 m³ por tripulante para misiones largas)
    const minNHV = missionParams.crewSize * 28;
    
    // Calcular NHV actual (suma de volúmenes de módulos + factor de ineficiencia)
    const moduleVolume = modules.reduce((sum, mod) => sum + mod.minVolume, 0);
    const actualNHV = moduleVolume * 1.3; // Factor de ineficiencia de empaquetamiento

    // Contar cuartos privados
    const crewQuarters = modules.filter(m => m.type === 'crew_quarters').length;

    // Contar zonas limpias y sucias
    const cleanZones = modules.filter(m => m.isClean).length;
    const dirtyZones = modules.filter(m => !m.isClean).length;

    // Estimar masa (factor aproximado: 100 kg/m³ de volumen)
    const estimatedMass = actualNHV * 100 + modules.length * 50;

    // Evaluar estado
    const nhvStatus = actualNHV >= minNHV ? 'sufficient' : 'insufficient';
    const privacyStatus = (missionParams.duration === 'long' && crewQuarters >= missionParams.crewSize) || 
                          (missionParams.duration !== 'long') ? 'adequate' : 'insufficient';
    const separationStatus = checkContamination().length === 0 ? 'good' : 'poor';

    return {
      minNHV,
      actualNHV,
      nhvStatus,
      crewQuarters,
      privacyStatus,
      cleanZones,
      dirtyZones,
      separationStatus,
      estimatedMass
    };
  };

  // ===== SISTEMA DE PUNTAJE =====
  const calculateScore = () => {
    const metrics = calculateMetrics();
    const contaminations = checkContamination();
    let score = 0;
    let maxScore = 0;
    const breakdown = [];

    // 1. VOLUMEN HABITABLE (30 puntos máximo)
    maxScore += 30;
    if (metrics.nhvStatus === 'sufficient') {
      const volumeRatio = metrics.actualNHV / metrics.minNHV;
      if (volumeRatio >= 1.0 && volumeRatio <= 1.5) {
        // Óptimo: 100-150% del mínimo
        score += 30;
        breakdown.push({ category: 'Volumen Habitable', points: 30, max: 30, status: 'excellent' });
      } else if (volumeRatio > 1.5 && volumeRatio <= 2.0) {
        // Aceptable pero ineficiente
        score += 20;
        breakdown.push({ category: 'Volumen Habitable', points: 20, max: 30, status: 'good' });
      } else if (volumeRatio > 2.0) {
        // Muy ineficiente (demasiado espacio = más masa)
        score += 10;
        breakdown.push({ category: 'Volumen Habitable', points: 10, max: 30, status: 'poor' });
      }
    } else {
      breakdown.push({ category: 'Volumen Habitable', points: 0, max: 30, status: 'fail' });
    }

    // 2. PRIVACIDAD (25 puntos máximo)
    maxScore += 25;
    if (missionParams.duration === 'long') {
      if (metrics.crewQuarters >= missionParams.crewSize) {
        score += 25;
        breakdown.push({ category: 'Privacidad', points: 25, max: 25, status: 'excellent' });
      } else if (metrics.crewQuarters >= missionParams.crewSize * 0.75) {
        score += 15;
        breakdown.push({ category: 'Privacidad', points: 15, max: 25, status: 'good' });
      } else {
        breakdown.push({ category: 'Privacidad', points: 0, max: 25, status: 'fail' });
      }
    } else {
      // Misiones cortas/moderadas son más flexibles
      if (metrics.crewQuarters >= missionParams.crewSize * 0.5) {
        score += 25;
        breakdown.push({ category: 'Privacidad', points: 25, max: 25, status: 'excellent' });
      } else {
        score += 15;
        breakdown.push({ category: 'Privacidad', points: 15, max: 25, status: 'good' });
      }
    }

    // 3. SEPARACIÓN FUNCIONAL (30 puntos máximo)
    maxScore += 30;
    if (contaminations.length === 0) {
      score += 30;
      breakdown.push({ category: 'Separación Limpio/Sucio', points: 30, max: 30, status: 'excellent' });
    } else if (contaminations.length <= 2) {
      score += 15;
      breakdown.push({ category: 'Separación Limpio/Sucio', points: 15, max: 30, status: 'poor' });
    } else {
      breakdown.push({ category: 'Separación Limpio/Sucio', points: 0, max: 30, status: 'fail' });
    }

    // 4. EFICIENCIA DE MASA (15 puntos máximo)
    maxScore += 15;
    const massPerCrew = metrics.estimatedMass / missionParams.crewSize;
    if (massPerCrew < 3000) {
      score += 15;
      breakdown.push({ category: 'Eficiencia de Masa', points: 15, max: 15, status: 'excellent' });
    } else if (massPerCrew < 4000) {
      score += 10;
      breakdown.push({ category: 'Eficiencia de Masa', points: 10, max: 15, status: 'good' });
    } else {
      score += 5;
      breakdown.push({ category: 'Eficiencia de Masa', points: 5, max: 15, status: 'poor' });
    }

    // 5. MÓDULOS ESENCIALES (Bonus - hasta 20 puntos)
    const hasGalley = modules.some(m => m.type === 'galley');
    const hasHygiene = modules.some(m => m.type === 'hygiene');
    const hasWCS = modules.some(m => m.type === 'wcs');
    const hasExercise = modules.some(m => m.type === 'exercise');
    const hasWorkstation = modules.some(m => m.type === 'workstation');

    const essentialModules = [hasGalley, hasHygiene, hasWCS, hasExercise, hasWorkstation];
    const essentialCount = essentialModules.filter(Boolean).length;
    const essentialPoints = essentialCount * 4;
    
    score += essentialPoints;
    breakdown.push({ 
      category: 'Módulos Esenciales', 
      points: essentialPoints, 
      max: 20, 
      status: essentialCount >= 4 ? 'excellent' : essentialCount >= 3 ? 'good' : 'poor',
      details: `${essentialCount}/5 módulos presentes`
    });

    // Calcular porcentaje y clasificación
    const totalMaxScore = maxScore + 20; // Incluir bonus
    const percentage = Math.round((score / totalMaxScore) * 100);
    
    let grade = '';
    let gradeColor = '';
    if (percentage >= 90) {
      grade = 'Excelente - NASA Aprobado';
      gradeColor = 'text-green-600';
    } else if (percentage >= 75) {
      grade = 'Bueno - Necesita Ajustes Menores';
      gradeColor = 'text-blue-600';
    } else if (percentage >= 60) {
      grade = 'Aceptable - Requiere Mejoras';
      gradeColor = 'text-yellow-600';
    } else {
      grade = 'Insuficiente - Rediseñar';
      gradeColor = 'text-red-600';
    }

    return {
      score,
      maxScore: totalMaxScore,
      percentage,
      grade,
      gradeColor,
      breakdown
    };
  };

  return (
    <HabitatContext.Provider value={{
      missionParams,
      setMissionParams,
      modules,
      setModules,
      checkContamination,
      calculateMetrics
    }}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 text-white">
            <h1 className="text-4xl font-bold mb-2">
              🚀 HABiT
            </h1>
            <p className="text-xl">
              Habitat Interactive Tool
            </p>
            <p className="text-sm mt-2 opacity-90">
              Aprende los principios de diseño de hábitats espaciales mediante restricciones reales de NASA
            </p>
          </div>

          {/* Componentes principales */}
          <MissionSetup />
          <DesignCanvas />
          <HabitabilityMetrics />

          {/* Footer educativo */}
          <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-white text-center">
            <p className="text-sm">
              💡 <strong>Recuerda:</strong> Un diseño exitoso minimiza masa y maximiza funcionalidad. 
              La disposición adecuada reduce hacinamiento y mejora salud de la tripulación.
            </p>
          </div>
        </div>
      </div>
    </HabitatContext.Provider>
  );
}

export default App;
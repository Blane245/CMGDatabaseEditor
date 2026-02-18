# CMG Database Editor

Implemented with React/Vite, this application provides maintenace services for the CMG Database. That database consists of sequencing and ensemble definitions. These tables are used by CMG to define algorithmic sequencer values and stochastic composition ensembles. 

# Sequencers

A sequence is a list of values that have beat durations. A typical use is to define a tune as a list of notes that have pitches and durations. A sequence can be applied to any sound attribute (pitch, attack, speed, duration, volume, or pitch). 

Sequences can be associated with tags for searching. 

## Sequence Maintenance

A sequence has the following attributes:
- *Type* - either note, attack, speed, duration, volume, or pan
- *Name* - a name that is unique within the list of sequence types. 'Note,sequence1' is different than 'Attack,sequence1'
- *Tags* - an optional list of tags associated with the sequence
- *Sequence List* - the list of zero or more values and beat counts. For example, a C scale with 1 beat per for would be 'C4,1;D4,1;E4,1;F4,1;G4,1;A5,1;B5,1;C5,1'.

Tags are simple as they only have a name but can be associated with zero or more sequences

A sequence may be added with the above attributes. For each sequence, the following functions are provided:

- Search - a list of sequences that have the listed tags assigned, or match a name patter are listed. From this list a sequence can be modified. The sequences that have a specific tag assign may also be listed and then modified.
- Modify - the current sequence is presented, and the user can change any of the values, except the name. A new entry can be made to the list. Each entry can be deleted or modified.
- Rename - a sequence can be renamed. The name must be unique with the type.
- Duplicate - a sequence can be duplicated to any type available. The name must be unique with the type.
- Delete - a sequence can be deleted.

All sequence type list use values that appropriate to the type, except note. For example, a pan item must be a number between -1 and +1, inclusive. In the case of notes,
the value, accidental, octave, and cents are defined. The values are [a-g] or [A-G]. The accident is either b or # and is optional, The octave is 0 through 9. The cents, which are optional, are between -99 and +99. 

# Ensemble Maintenance

An ensemble is a list of voices that are used by the Stochastic generator in CMG to construct compositions, and generate sounds. An ensemble has a unique name, an optional descripion, and a list of voices used by the ensemble. Ensembles may be added, modified, or deleted. 

A voice has the following attributes:
- *Name* - a unique name
- *Description* - an optional description
- *Soundfont File* - the name of the soundfont file that the voice uses. This must be one of the soundfont files in the C:/soundfonts directory
- *Preset* - the name of the preset within the soundfont file that the voices uses to generate sound samples
- *Timbre* - either sustained or glissando. Sustained timbre holds the voice's not for the interval (or duration), while glissando slides the note from one pitch to another during the interval.
- *Duration* - this is 0 if the sound should occurred during the entire interval of the note; otherwise it is the number of seconds to hold the note. This is useful for generating staccato notes.
- *register* - the range of values that the voice can achieve. This is given in the midi scale (0-127) 

Voices may be added modified or deleted. 

# Application 
The application runs as a service on Windows and uses port 3000.

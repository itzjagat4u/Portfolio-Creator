// pages/index.js
import { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';

const blankEdu = () => ({ degree: '', school: '', year: '' });
const blankExp = () => ({ role: '', company: '', period: '', desc: '' });
const blankProj = () => ({ title: '', stack: '', desc: '' });

export default function Home() {
  const [template, setTemplate] = useState('classic');
  const [photo, setPhoto] = useState(null);
  const [personal, setPersonal] = useState({
    name: '', email: '', phone: '', linkedin: '', github: ''
  });
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState([blankEdu()]);
  const [experience, setExperience] = useState([blankExp()]);
  const [projects, setProjects] = useState([blankProj()]);
  const previewRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem('resume-advanced');
    if (raw) {
      const data = JSON.parse(raw);
      setTemplate(data.template ?? 'classic');
      setPhoto(data.photo ?? null);
      setPersonal(data.personal ?? personal);
      setSkills(data.skills ?? '');
      setEducation(data.education?.length ? data.education : [blankEdu()]);
      setExperience(data.experience?.length ? data.experience : [blankExp()]);
      setProjects(data.projects?.length ? data.projects : [blankProj()]);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const data = { template, photo, personal, skills, education, experience, projects };
    localStorage.setItem('resume-advanced', JSON.stringify(data));
  }, [template, photo, personal, skills, education, experience, projects]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const addItem = (listSetter, blankFn) => listSetter((prev) => [...prev, blankFn()]);
  const removeItem = (listSetter, index) =>
    listSetter((prev) => prev.filter((_, i) => i !== index));

  // ---------- PDF ----------
  const downloadPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const left = 48;
    let y = 56;

    let headingFont = 'helvetica';
    let bodyFont = 'helvetica';
    let headingSize = 13;
    let bodySize = 11;
    let headingColor = [0, 0, 0];

    if (template === 'modern') {
      headingSize = 14;
      headingColor = [59, 130, 246];
    } else if (template === 'minimal') {
      bodyFont = 'times';
      headingSize = 12;
      bodySize = 11;
      headingColor = [37, 99, 235];
    } else if (template === 'elegant') {
      bodyFont = 'times';
      headingFont = 'times';
      headingSize = 15;
      bodySize = 12;
      headingColor = [124, 45, 18];
    }

    const section = (title) => {
      doc.setFont(headingFont, 'bold');
      doc.setFontSize(headingSize);
      doc.setTextColor(...headingColor);
      doc.text(title, left, y);
      y += 14;
      doc.setFont(bodyFont, 'normal');
      doc.setFontSize(bodySize);
      doc.setTextColor(0, 0, 0);
    };

    if (photo) {
      try { doc.addImage(photo, 'JPEG', 420, 40, 120, 120); } catch {}
    }

    // Name
    doc.setFont(headingFont, 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(personal.name || 'Your Name', left, y);
    y += 28;

    // Contacts (text only)
    doc.setFont(bodyFont, 'normal');
    doc.setFontSize(bodySize);
    doc.setTextColor(50, 50, 50);

    if (personal.email) { doc.text(`Email: ${personal.email}`, left, y); y += 16; }
    if (personal.phone) { doc.text(`Phone: ${personal.phone}`, left, y); y += 16; }
    if (personal.linkedin) { doc.text(`LinkedIn: ${personal.linkedin}`, left, y); y += 16; }
    if (personal.github) { doc.text(`GitHub: ${personal.github}`, left, y); y += 16; }

    y += 10;

    // Skills
    if (skills.trim()) {
      section('Skills');
      const lines = doc.splitTextToSize(skills, 512);
      doc.text(lines, left, y);
      y += lines.length * 14 + 8;
    }

    // Education
    if (education.some(e => e.degree || e.school)) {
      section('Education');
      education.forEach((e) => {
        const line1 = [e.degree, e.school].filter(Boolean).join(' — ');
        if (line1) {
          doc.setFont(headingFont, 'bold');
          doc.setFontSize(bodySize);
          doc.text(line1, left, y);
          y += 14;
        }
        if (e.year) {
          doc.setFont(bodyFont, 'normal');
          doc.setFontSize(bodySize);
          doc.text(String(e.year), left, y);
          y += 14;
        }
        y += 6;
      });
      y += 4;
    }

    // Experience
    if (experience.some(ex => ex.role || ex.company || ex.desc)) {
      section('Experience');
      experience.forEach((ex) => {
        const head = [ex.role, ex.company].filter(Boolean).join(' — ');
        if (head) {
          doc.setFont(headingFont, 'bold');
          doc.setFontSize(bodySize);
          doc.text(head, left, y);
          y += 14;
        }
        if (ex.period) {
          doc.setFont(bodyFont, 'normal');
          doc.setFontSize(bodySize);
          doc.text(ex.period, left, y);
          y += 14;
        }
        if (ex.desc) {
          const lines = doc.splitTextToSize(ex.desc, 512);
          doc.text(lines, left, y);
          y += lines.length * 14;
        }
        y += 8;
      });
      y += 4;
    }

    // Projects
    if (projects.some(p => p.title || p.desc)) {
      section('Projects');
      projects.forEach((p) => {
        if (p.title) {
          doc.setFont(headingFont, 'bold');
          doc.setFontSize(bodySize);
          doc.text(p.title, left, y);
          y += 14;
        }
        const meta = p.stack ? `Stack: ${p.stack}` : '';
        if (meta) {
          doc.setFont(bodyFont, 'normal');
          doc.setFontSize(bodySize);
          doc.text(meta, left, y);
          y += 14;
        }
        if (p.desc) {
          const lines = doc.splitTextToSize(p.desc, 512);
          doc.text(lines, left, y);
          y += lines.length * 14;
        }
        y += 8;
      });
    }

    doc.save('resume.pdf');
  };

  return (
    <div className="wrap">
      <div className="col">
        <h1 className="app-title">RESUME BUILDER</h1>
        <p className="credit">Made by: Jagat Singh</p>

        <div className="card">
          <div className="row">
            <label>Choose Template</label>
            <div className="template-grid">
              {['classic', 'modern', 'minimal', 'elegant'].map(t => (
                <div
                  key={t}
                  className={`template-card ${template === t ? 'active' : ''}`}
                  onClick={() => setTemplate(t)}
                >
                  <div className={`thumb ${t}`}></div>
                  <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid2">
            <div className="row"><label>Name</label>
              <input value={personal.name} onChange={e=>setPersonal({...personal, name:e.target.value})} />
            </div>
            <div className="row"><label>Email</label>
              <input value={personal.email} onChange={e=>setPersonal({...personal, email:e.target.value})} />
            </div>
            <div className="row"><label>Phone</label>
              <input value={personal.phone} onChange={e=>setPersonal({...personal, phone:e.target.value})} />
            </div>
            <div className="row"><label>LinkedIn</label>
              <input value={personal.linkedin} onChange={e=>setPersonal({...personal, linkedin:e.target.value})} />
            </div>
            <div className="row"><label>GitHub</label>
              <input value={personal.github} onChange={e=>setPersonal({...personal, github:e.target.value})} />
            </div>
            <div className="row"><label>Photo</label>
              <input type="file" accept="image/*" onChange={handlePhoto} />
            </div>
          </div>

          <div className="row"><label>Skills (comma separated)</label>
            <textarea rows={2} value={skills} onChange={e=>setSkills(e.target.value)} />
          </div>
        </div>

        <Section
          title="Education"
          items={education}
          onAdd={() => addItem(setEducation, blankEdu)}
          onRemove={(i)=>removeItem(setEducation, i)}
          render={(e, i) => (
            <>
              <input placeholder="Degree" value={e.degree}
                onChange={ev=>updateAt(education, setEducation, i, { degree: ev.target.value })} />
              <input placeholder="School" value={e.school}
                onChange={ev=>updateAt(education, setEducation, i, { school: ev.target.value })} />
              <input placeholder="Year" value={e.year}
                onChange={ev=>updateAt(education, setEducation, i, { year: ev.target.value })} />
            </>
          )}
        />

        <Section
          title="Experience"
          items={experience}
          onAdd={() => addItem(setExperience, blankExp)}
          onRemove={(i)=>removeItem(setExperience, i)}
          render={(ex, i) => (
            <>
              <input placeholder="Role" value={ex.role}
                onChange={ev=>updateAt(experience, setExperience, i, { role: ev.target.value })} />
              <input placeholder="Company" value={ex.company}
                onChange={ev=>updateAt(experience, setExperience, i, { company: ev.target.value })} />
              <input placeholder="Period (e.g., 2023–2025)" value={ex.period}
                onChange={ev=>updateAt(experience, setExperience, i, { period: ev.target.value })} />
              <textarea placeholder="Description" rows={3} value={ex.desc}
                onChange={ev=>updateAt(experience, setExperience, i, { desc: ev.target.value })} />
            </>
          )}
        />

        <Section
          title="Projects"
          items={projects}
          onAdd={() => addItem(setProjects, blankProj)}
          onRemove={(i)=>removeItem(setProjects, i)}
          render={(p, i) => (
            <>
              <input placeholder="Title" value={p.title}
                onChange={ev=>updateAt(projects, setProjects, i, { title: ev.target.value })} />
              <input placeholder="Tech Stack" value={p.stack}
                onChange={ev=>updateAt(projects, setProjects, i, { stack: ev.target.value })} />
              <textarea placeholder="Description" rows={3} value={p.desc}
                onChange={ev=>updateAt(projects, setProjects, i, { desc: ev.target.value })} />
            </>
          )}
        />

        <div className="actions">
          <button onClick={()=>{
            localStorage.removeItem('resume-advanced');
            window.location.reload();
          }}>Reset</button>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>

      {/* Preview */}
      <div className="col">
        <div className={`preview ${template}`} ref={previewRef}>
          <div className="header">
            <div>
              <h2>{personal.name || 'Your Name'}</h2>
              <div className="contacts">
                {personal.email && <div>📧 {personal.email}</div>}
                {personal.phone && <div>📱 {personal.phone}</div>}
                {personal.linkedin && <div>🔗 LinkedIn: {personal.linkedin}</div>}
                {personal.github && <div>💻 GitHub: {personal.github}</div>}
              </div>
            </div>
            {photo && <img src={photo} alt="profile" className="avatar" />}
          </div>

          {skills.trim() && (
            <SectionBlock title="Skills">
              <p>{skills}</p>
            </SectionBlock>
          )}

          {education.some(e => e.degree || e.school) && (
            <SectionBlock title="Education">
              {education.map((e, i)=>( 
                <div key={i} className="rowline">
                  <b>{e.degree}</b> {e.school && `— ${e.school}`} {e.year && <span className="muted">({e.year})</span>}
                </div>
              ))}
            </SectionBlock>
          )}

          {experience.some(ex => ex.role || ex.company || ex.desc) && (
            <SectionBlock title="Experience">
              {experience.map((ex, i)=>( 
                <div key={i} className="stack">
                  <div><b>{ex.role}</b> {ex.company && `— ${ex.company}`}</div>
                  {ex.period && <div className="muted">{ex.period}</div>}
                  {ex.desc && <div>{ex.desc}</div>}
                </div>
              ))}
            </SectionBlock>
          )}

          {projects.some(p => p.title || p.desc) && (
            <SectionBlock title="Projects">
              {projects.map((p, i)=>( 
                <div key={i} className="stack">
                  <div><b>{p.title}</b>{p.stack && <span className="muted"> — {p.stack}</span>}</div>
                  {p.desc && <div>{p.desc}</div>}
                </div>
              ))}
            </SectionBlock>
          )}
        </div>
      </div>
    </div>
  );
}

function updateAt(list, setter, index, patch) {
  setter(list.map((item, i) => i === index ? { ...item, ...patch } : item));
}

function Section({ title, items, render, onAdd, onRemove }) {
  return (
    <div className="card">
      <div className="cardhead">
        <h3>{title}</h3>
        <div>
          <button onClick={onAdd}>+ Add</button>
        </div>
      </div>
      {items.map((it, i)=>(
        <div className="grid1" key={i}>
          {render(it, i)}
          {items.length > 1 && (
            <div className="right">
              <button className="danger" onClick={()=>onRemove(i)}>Remove</button>
            </div>
          )}
          <div className="sep" />
        </div>
      ))}
    </div>
  );
}

function SectionBlock({ title, children }) {
  return (
    <div className="block">
      <div className="blockhead">{title}</div>
      <div>{children}</div>
    </div>
  );
}

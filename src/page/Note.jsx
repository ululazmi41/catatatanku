import React from 'react';
import Header from '../layout/Header';
import { showFormattedDate } from '../utils';
import Loading from '../components/Loading';

const CHARSLENGTH = 50

class Note extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: -1,
      title: '',
      body: '',
      createdAt: +new Date(),
      archived: false,
      state: 'new', // new || update
      charsLeft: CHARSLENGTH,
      isLoading: false,
      isContentEdited: false,
    }

    // Init
    this.getCurrentNoteIndex = this.getCurrentNoteIndex.bind(this);

    // Loading
    this.renderLoading = this.renderLoading.bind(this);
    this.removeLoading = this.removeLoading.bind(this);

    // Others
    this.onSubmit = this.onSubmit.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.renderNote = this.renderNote.bind(this);
    this.renderCharsLeft = this.renderCharsLeft.bind(this);
    this.renderTagArchive = this.renderTagArchive.bind(this);

    // Input onChange handler
    this.onBodyChangeHandler = this.onBodyChangeHandler.bind(this);
    this.onTitleChangeHandler = this.onTitleChangeHandler.bind(this);
  }

  componentDidMount() {
    const noteIndex = this.getCurrentNoteIndex();
    const index = parseInt(noteIndex);
    const note = this.props.getNoteById(index);

    if (note === null || note === undefined) {
      //
    } else {
      this.setState({
        id: note.id,
        title: note.title,
        body: note.body,
        createdAt: note.createdAt,
        archived: note.archived,
        state: 'update',
        isDateUpdated: false,
      })
      this.renderNote(note);
      this.renderTagArchive(note);
    }
  }

  renderTagArchive(note) {
    const tagElement = document.querySelector('.tag');

    if (note.archived) {
      tagElement.style.display = 'grid';
    }
  }

  renderNote(note) {
    const {
      title,
      body,
      createdAt,
    } = note;

    const titleElement = document.querySelector('#judul');
    titleElement.value = title;

    const bodyElement = document.querySelector('#isi');
    bodyElement.value = body;

    const createdAtElement = document.querySelector('#tanggal');
    createdAtElement.value = showFormattedDate(createdAt);
  }

  getCurrentNoteIndex() {
    const url = window.location.pathname;
    const index = url.split('/')[2];
    return index;
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.renderLoading(() => {
      if (this.state.state === 'new') {
        this.props.handleSubmit(this.state.title, this.state.body);
      } else if (this.state.state === 'update') {
        const note = {
          id: this.state.id,
          title: this.state.title,
          body: this.state.body,
          createdAt: this.state.createdAt,
          archived: this.state.archived,
        }
        this.props.handleUpdate(note);
      }
      this.props.navigateTo('');
      this.props.homeNavigateTo('notes');
    }, 750);
  }

  updateDate() {
    this.setState({
      isDateUpdated: true,
      createdAt: +new Date(),
    });
  }

  onTitleChangeHandler(event) {
    if (!this.state.isDateUpdated) {
      this.updateDate();
    }

    if (event.target.value.length > CHARSLENGTH) {
      this.setState({
        charsLeft: 0,
      });
      return;
    }

    this.setState({
      title: event.target.value,
      charsLeft: CHARSLENGTH - event.target.value.length,

      isContentEdited: true,
    })
  }

  onBodyChangeHandler(event) {
    if (!this.state.isDateUpdated) {
      this.updateDate();
    }

    this.setState({
      body: event.target.value,
      isContentEdited: true,
    })

    // reset textarea height
    const textarea = document.querySelector("#isi");
    const noteInput = document.querySelector(".note-input");
    const wrapper = document.createElement('div');
    wrapper.style.maxWidth = noteInput.style.maxWidth;

    const copyTextarea = document.createElement('textarea');
    const defaultHeight = 150; // 150px
    copyTextarea.style.width = textarea.style.width;

    // Salin teks ke textarea rekayasa
    copyTextarea.value = textarea.value;

    wrapper.appendChild(copyTextarea);
    document.querySelector('body').appendChild(wrapper);

    // ambil tingginya
    const height = copyTextarea.scrollHeight - defaultHeight + 150;

    // Set ulang tinggi di textarea catatan
    textarea.style.height = `${height}px`;

    wrapper.removeChild(copyTextarea);
    document.querySelector('body').removeChild(wrapper);
  }

  renderCharsLeft() {
    const stillEmpty = this.state.charsLeft === CHARSLENGTH;
    const twentiesAndBelow = this.state.charsLeft <= 20 && this.state.charsLeft > 0;
    const moreThanTen = this.state.charsLeft > 0;

    if (stillEmpty) {
      return <p className='note-input__title__char-limit tw-text-transparent'>placeholder</p>;
    } else if (twentiesAndBelow) {
      return <p className='note-input__title__char-limit tw-text-brown'>{this.state.charsLeft}</p>
    } else if (moreThanTen) {
      return <p className='note-input__title__char-limit tw-text-grey'>{this.state.charsLeft}</p>
    } else {
      return <p className='note-input__title__char-limit tw-text-red'>{this.state.charsLeft}</p>
    }
  }

  renderLoading() {
    this.setState({
      isLoading: true,
    })
  }

  removeLoading() {
    this.setState({
      isLoading: false,
    })
  }

  render() {
    return (
      <>
        {this.state.isLoading && (
          <div>
            <Loading />
          </div>
        )}
        <Header />
        <form className='note-input' onSubmit={this.onSubmit}>
          {this.renderCharsLeft()}
          <input
            id="judul"
            type="text"
            name="judul"
            placeholder='Judul'
            value={this.state.title}
            className={this.state.archived ? 'note-input__title tw-cursor-default' : 'note-input__title'}
            onChange={this.onTitleChangeHandler}
            readOnly={this.state.archived}
            required
          />
          <div className="note-input__date-wrapper">
            <p id="tanggal" className='note-input__date'>{showFormattedDate(this.state.createdAt)}</p>
            <div className='tag'>Arsip</div>
          </div>
          <textarea
            id="isi"
            type="text"
            name="isi"
            value={this.state.body}
            className={this.state.archived ? 'note-input__body tw-cursor-default' : 'note-input__body'}
            placeholder='Catatan'
            onChange={this.onBodyChangeHandler}
            readOnly={this.state.archived}
            required
          />
          {this.state.isContentEdited && (
            this.state.state === 'new'
              ? <button type="submit">Simpan</button>
              : <button type="submit">Perbarui</button>
          )
          }
        </form>
      </>
    );
  }
}

export default Note;
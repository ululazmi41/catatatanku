import React from 'react';
import Header from '../../layout/header';
import NoteSearch from './components/NoteSearch';
import ActiveNotes from './components/ActiveNotes';
import { showFormattedDate } from '../../utils';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      isBlur: false,
      isLoading: false,
      loadingTimeout: null,
    }

    // Others
    this.handleNotes = this.handleNotes.bind(this);
    this.handleNavigateToAdd = this.handleNavigateToAdd.bind(this);

    // Search
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.properlyRenderNavigation = this.renderNavigationButton.bind(this);

    // actions on note
    this.onToggleArchive = this.onToggleArchive.bind(this);

    // Navigation
    this.doTimeout = this.renderLoading.bind(this); // loading animation
    this.showNotes = this.showNotes.bind(this);
    this.showArchives = this.showArchives.bind(this);
  }

  componentDidMount() {
    this.renderNavigationButton(this.props.showing);
  }

  renderNavigationButton(page) {
    const notes = document.querySelector('#notes');
    const archives = document.querySelector('#archives');

    if (page === 'notes') {
      notes.className = 'notes-app__button notes-app__button__selected';
      archives.className = 'notes-app__button notes-app__button__idle';
    } else if (page === 'archives') {
      archives.className = 'notes-app__button notes-app__button__selected';
      notes.className = 'notes-app__button notes-app__button__idle';
    } else {
      //
    }
  }

  /**
   * Search
   */
  handleSearch(event) {
    event.preventDefault();
    this.setState({
      search: event.target.value.toLowerCase(),
    });
  }

  handleDelete(id) {
    this.setState({
      isBlur: true,
    })

    this.renderLoading(400, () => {
      this.props.onDelete(id);
    });
  }

  onToggleArchive(id) {
    this.setState({
      isBlur: true,
    })

    this.renderLoading(400, () => {
      this.setState(() => {
        const copy = this.props.notes.slice();
        const index = copy.findIndex((note) => note.id === id);
        copy[index].archived = !copy[index].archived;
        if (copy[index].archived) {
          console.log(`Archiving note with id of ${id}`);
      
          this.props.addToaster('archive');
        } else {
          console.log(`Unarchiving note with id of ${id}`);
      
          this.props.addToaster('restore');
        }
        return {
          notes: copy,
        }
      });
    });
  }

  /**
   * Note Pages
   */
  renderLoading(ms, fun) {
    if (this.state.loadingTimeout != null) {
      clearTimeout(this.state.loadingTimeout);
    }

    this.setState({
      isLoading: true,
    })

    this.setState({
      loadingTimeout: setTimeout(() => {
        this.setState({
          isLoading: false,
        });

        if (fun) {
          fun();
        }
      }, ms),
    });
  }

  showNotes() {
    this.renderNavigationButton('notes');

    this.setState({
      isBlur: false,
    })

    this.renderLoading(750);
    this.props.homeNavigateTo('notes');
  }

  showArchives() {
    this.renderNavigationButton('archives');

    this.setState({
      isBlur: false,
    })

    this.renderLoading(750);

    this.props.homeNavigateTo('archives');
  }

  /**
   * Handle Notes to Render
   */
  handleNotes() {
    let notes = [];
    let archives = [];

    if (this.state.search === '') {
      notes = this.props.notes.filter((note) => note.archived === false);
      archives = this.props.notes.filter((note) => note.archived === true);
    } else {
      const tempNotes = this.props.notes.filter((note) => note.archived === false);
      notes = tempNotes.filter((note) => {
        const isIncludingTitle = note.title.toLowerCase().includes(this.state.search);
        const isIncludingDate = showFormattedDate(note.createdAt).toLowerCase().includes(this.state.search);
        const isIncludingBody = note.body.toLowerCase().includes(this.state.search);

        if (isIncludingTitle || isIncludingDate || isIncludingBody) {
          return true;
        } else {
          return false;
        }
      })

      const tempArchives = this.props.notes.filter((note) => note.archived === true);
      archives = tempArchives.filter((note) => {
        const isIncludingTitle = note.title.toLowerCase().includes(this.state.search);
        const isIncludingDate = showFormattedDate(note.createdAt).toLowerCase().includes(this.state.search);
        const isIncludingBody = note.body.toLowerCase().includes(this.state.search);

        if (isIncludingTitle || isIncludingDate || isIncludingBody) {
          return true;
        } else {
          return false;
        }
      })
    }

    if (this.props.showing === 'notes') {
      return notes;
    } else if (this.props.showing === 'archives') {
      return archives;
    } else {
      return [];
    }
  }

  handleNavigateToAdd() {
    this.props.renderLoading(() => {
      this.props.navigateTo('note');
    }, 250);
  }

  render() {
    return (
      <>
        <Header />
        <main className='note-app__body'>
          <button className="notes-app__body__button-add" onClick={this.handleNavigateToAdd}>Tambah</button>
          <div className='note-app__body__actions'>
            <div className="note-app__body__buttons">
              <button id="notes" onClick={this.showNotes} className="">Catatan</button>
              <button id="archives" onClick={this.showArchives} className="">Arsip</button>
            </div>
            <NoteSearch onChange={this.handleSearch} />
          </div>
          <ActiveNotes
            notes={this.handleNotes()}
            isBlur={this.state.isBlur}
            isLoading={this.state.isLoading}
            onDelete={this.handleDelete}
            navigateTo={this.props.navigateTo}
            onToggleArchive={this.onToggleArchive}
          />
        </main>
      </>
    )
  }
}

export default Home;
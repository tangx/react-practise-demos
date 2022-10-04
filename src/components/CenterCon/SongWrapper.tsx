import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import line from '../../images/line.png'
import { RootState } from '../../redux/store'
import axios from 'axios'
import { SongDetail, SongCover, Music } from '../types/Song.types'
import { HotComment } from '../types/HotComment.types'
import { updateMusic } from '../../redux/actions/music'
import { updateComments } from '../../redux/actions/comments'

interface SongWrapperProps {
  // songs: Song[]
  // getMusic: (id: number) => void
  playMV: (id: number) => void
}



interface SongDetailRespData {
  code: number
  data: SongDetail[]
}



function getMusicURL(id: number) {

  const target = `https://autumnfish.cn/song/url?id=${id}`
  return axios.get<SongDetailRespData>(target)
    .then(
      (resp) => {
        if (resp.data.code !== 200) {
          return undefined
        }

        const { data } = resp.data
        if (data.length < 1) {
          console.log("music not found");
          return ""
        }

        const music = data[0]
        return music.url
      },
      (err) => {
        console.log(err);
        return undefined
      }
    )
}


interface GetSongCoverRespData {
  code: number
  songs: SongCover[]
}


function getCoverURL(id: number) {
  return axios.get<GetSongCoverRespData>(`https://autumnfish.cn/song/detail?ids=${id}`)
    .then(
      (resp) => {
        if (resp.data.code !== 200) {
          return undefined
        }

        const { songs } = resp.data
        if (songs.length < 1) {
          console.log("music detail not found");
          return ""
        }

        const detail = songs[0]
        return detail.al.picUrl
      },
      (err) => {
        console.log(err);
        return undefined
      }
    )
}



interface HotCommentRespData {
  code: 200
  hotComments: HotComment[]
  total: number
}

function getComments(id: number) {
  // 获取评论
  return axios.get<HotCommentRespData>(`https://autumnfish.cn/comment/hot?type=0&id=${id}`)
    .then(
      (resp) => {
        if (resp.data.code != 200) {
          return [] as HotComment[]
        }
        // console.log(resp.data.hotComments);
        return resp.data.hotComments

      },
      (err) => {
        console.log(err);
        return [] as HotComment[]
      }
    )
}

export default function SongWrapper(props: SongWrapperProps) {

  const dispatch = useDispatch()

  const songs = useSelector((state: RootState) => { return state.songs })



  async function getMusic(id: number) {
    /* 获取音乐信息， 播放地址和封面地址 */
    const musicURL = await getMusicURL(id)
    const coverURL = await getCoverURL(id)

    const music: Music = {
      coverURL: coverURL!,
      musicURL: musicURL!,
    }
    dispatch(updateMusic(music))

    /* 获取音乐信息， 评论信息 */
    const comments = await getComments(id)
    dispatch(updateComments(comments))

  }


  return (
    <div className='song_wrapper'>
      <ul className='song_list'>
        {
          songs.map((song) => {
            return (
              <li key={song.id} >
                <a href="#"
                  onClick={() => { getMusic(song.id) }}
                ></a>
                <b>{song.name}</b>

                <MvSpan mvid={song.mvid} playMV={props.playMV} />
              </li>
            )
          })
        }
      </ul >
      <img src={line} className="switch_btn" alt="" />
    </div >
  )
}

interface MvSpanProps {
  mvid: number
  playMV: (id: number) => void
}

export function MvSpan(props: MvSpanProps) {
  if (props.mvid !== 0) {
    return (
      <span onClick={() => { props.playMV(props.mvid) }}>
        <i></i>
      </span>
    )
  }

  return (
    <Fragment />
  )
}
